import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'STUDENT') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (studentError || !student) return new NextResponse('Student profile not found', { status: 404 })

    const { data: attendances, error: attendanceError } = await supabase
      .from('attendance')
      .select(`
        *,
        subject:subjects(name)
      `)
      .eq('student_id', student.id)
      .order('date', { ascending: true })

    if (attendanceError) throw attendanceError

    // Calculate overall percentage
    const totalClasses = attendances.length
    const presentClasses = attendances.filter((a: any) => a.status === 'PRESENT').length
    const overallPercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0

    // Group by subject for progress with totalClasses and attendedClasses
    const subjectStats: Record<string, { total: number; present: number }> = {}
    attendances.forEach((record: any) => {
      const subjectName = record.subject.name
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = { total: 0, present: 0 }
      }
      subjectStats[subjectName].total++
      if (record.status === 'PRESENT') {
        subjectStats[subjectName].present++
      }
    })

    const subjectProgress = Object.keys(subjectStats).map(subject => ({
      subject,
      totalClasses: subjectStats[subject].total,
      attendedClasses: subjectStats[subject].present,
      percentage: (subjectStats[subject].present / subjectStats[subject].total) * 100
    }))

    // Today's attendance
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const todayAttendance = attendances
      .filter((a: any) => {
        const d = new Date(a.date)
        return d >= today && d <= todayEnd
      })
      .map((a: any) => ({
        subject: a.subject.name,
        status: a.status
      }))

    const todayPresent = todayAttendance.filter((a: any) => a.status === 'PRESENT').length
    const todayTotal = todayAttendance.length
    const todayPercentage = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0

    return NextResponse.json({
      overallPercentage: Math.round(overallPercentage),
      currentStreak: student.current_streak,
      subjectProgress,
      todayAttendance,
      todayPercentage,
      recentAttendances: attendances.slice(-5)
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
