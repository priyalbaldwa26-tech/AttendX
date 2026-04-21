import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkConsecutiveAbsences, checkMonthlyNonConsecutiveAbsences } from '@/lib/attendanceAlerts'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'TEACHER') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { classId, subjectId, date, attendanceData } = body

    if (!classId || !subjectId || !date || !attendanceData) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (teacherError || !teacher) return new NextResponse('Teacher profile not found', { status: 404 })

    const dateObj = new Date(date)

    // Using Upsert for multiple records
    const { data: records, error: upsertError } = await supabase
      .from('attendance')
      .upsert(
        attendanceData.map((record: any) => ({
          student_id: record.studentId,
          class_id: classId,
          subject_id: subjectId,
          teacher_id: teacher.id,
          date: dateObj.toISOString(),
          status: record.status,
        })),
        { onConflict: 'student_id,class_id,subject_id,date' }
      )
      .select()

    if (upsertError) throw upsertError

    // Calculate streaks for impacted students
    for (const record of attendanceData) {
      if (record.status === 'PRESENT') {
        const { error: updateError } = await supabase.rpc('increment_streak', { student_id_param: record.studentId })
        if (updateError) {
          // If RPC fails, try manual update as fallback
          const { data: student } = await supabase.from('students').select('current_streak').eq('id', record.studentId).single()
          await supabase.from('students').update({ current_streak: (student?.current_streak || 0) + 1 }).eq('id', record.studentId)
        }
      } else {
        await supabase.from('students').update({ current_streak: 0 }).eq('id', record.studentId)
      }
    }

    // ──── Trigger attendance alerts asynchronously (fire-and-forget) ────
    const currentMonth = dateObj.getMonth() + 1
    const currentYear = dateObj.getFullYear()

    const absentStudentIds = attendanceData
      .filter((r: any) => r.status === 'ABSENT')
      .map((r: any) => r.studentId)

    if (absentStudentIds.length > 0) {
      // Run alert checks in background — don't await, don't block response
      Promise.allSettled(
        absentStudentIds.flatMap((studentId: string) => [
          checkConsecutiveAbsences(studentId),
          checkMonthlyNonConsecutiveAbsences(studentId, currentMonth, currentYear),
        ])
      ).then((results) => {
        const failed = results.filter(r => r.status === 'rejected')
        if (failed.length > 0) {
          console.error('[ALERTS] Some alert checks failed:', failed)
        }
      })
    }
    
    return NextResponse.json({ message: 'Attendance recorded successfully', count: records?.length || 0 })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
