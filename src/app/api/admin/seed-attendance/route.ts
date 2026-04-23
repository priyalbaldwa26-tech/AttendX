import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * POST /api/admin/seed-attendance
 * 
 * Seeds 1 month of random past attendance records for a specific class.
 * Each student gets 50-90% random attendance across all subjects.
 * Working days only (Mon-Sat, no Sundays).
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Find the class "B.TECH AI-CS SE"
    const { data: classes } = await supabase
      .from('classes')
      .select('id, name, class_teacher_id')

    if (!classes || classes.length === 0) {
      return new NextResponse('No classes found', { status: 404 })
    }

    // Try to find the specific class, fallback to first class
    const targetClass = classes.find(c => 
      c.name?.toLowerCase().includes('ai-cs') || 
      c.name?.toLowerCase().includes('b.tech')
    ) || classes[0]

    const classId = targetClass.id
    const teacherId = targetClass.class_teacher_id

    if (!teacherId) {
      return new NextResponse('Class has no teacher assigned', { status: 400 })
    }

    // Get all students in this class
    const { data: students } = await supabase
      .from('students')
      .select('id, student_id')
      .eq('class_id', classId)

    if (!students || students.length === 0) {
      return new NextResponse('No students found in this class', { status: 404 })
    }

    // Get all subjects
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, name')

    if (!subjects || subjects.length === 0) {
      return new NextResponse('No subjects found. Create subjects first.', { status: 404 })
    }

    // Generate dates for last 30 days (working days only: Mon-Sat)
    const today = new Date()
    const workingDays: string[] = []

    for (let i = 30; i >= 1; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const day = date.getDay() // 0=Sun, 6=Sat
      if (day !== 0) { // Skip Sundays
        workingDays.push(date.toISOString().split('T')[0])
      }
    }

    // For each student, decide a random attendance percentage (50-90%)
    // Then for each day+subject, randomly mark PRESENT or ABSENT
    const allRecords: any[] = []

    for (const student of students) {
      // Random target attendance between 50% and 90%
      const targetPct = Math.floor(Math.random() * 41) + 50 // 50 to 90

      for (const subject of subjects) {
        for (const dateStr of workingDays) {
          // Decide PRESENT or ABSENT based on target percentage
          const roll = Math.random() * 100
          const status = roll < targetPct ? 'PRESENT' : 'ABSENT'

          allRecords.push({
            student_id: student.id,
            class_id: classId,
            subject_id: subject.id,
            teacher_id: teacherId,
            date: `${dateStr}T09:00:00.000Z`,
            status,
          })
        }
      }
    }

    // Insert in batches of 500 (Supabase has limits)
    let inserted = 0
    const batchSize = 500

    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('attendance')
        .upsert(batch, { onConflict: 'student_id,class_id,subject_id,date' })

      if (error) {
        console.error(`Batch ${i / batchSize + 1} error:`, error)
        throw error
      }
      inserted += batch.length
    }

    // Update streaks for all students to a random value
    for (const student of students) {
      const randomStreak = Math.floor(Math.random() * 8) // 0-7 days
      await supabase
        .from('students')
        .update({ current_streak: randomStreak })
        .eq('id', student.id)
    }

    return NextResponse.json({
      message: 'Seed data created successfully!',
      class: targetClass.name,
      students: students.length,
      subjects: subjects.length,
      workingDays: workingDays.length,
      totalRecords: inserted,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return new NextResponse('Internal Error: ' + (error as any)?.message, { status: 500 })
  }
}
