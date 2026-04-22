import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Fetch counts in parallel
    const [studentsRes, teachersRes, classesRes, subjectsRes] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('teachers').select('id', { count: 'exact', head: true }),
      supabase.from('classes').select('id', { count: 'exact', head: true }),
      supabase.from('subjects').select('id', { count: 'exact', head: true }),
    ])

    const totalStudents = studentsRes.count ?? 0
    const totalTeachers = teachersRes.count ?? 0
    const totalClasses = classesRes.count ?? 0
    const totalSubjects = subjectsRes.count ?? 0

    // Calculate today's attendance percentage
    const today = new Date().toISOString().split('T')[0]

    const { data: todayRecords } = await supabase
      .from('attendance')
      .select('status')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)

    let attendancePercentage = 0
    if (todayRecords && todayRecords.length > 0) {
      const presentCount = todayRecords.filter((r: any) => r.status === 'PRESENT').length
      attendancePercentage = Math.round((presentCount / todayRecords.length) * 100)
    }

    // Get recent classes list
    const { data: recentClasses } = await supabase
      .from('classes')
      .select('id, name, year, department')
      .order('created_at', { ascending: false })
      .limit(4)

    // Get recent subjects list
    const { data: recentSubjects } = await supabase
      .from('subjects')
      .select('id, name, code')
      .order('created_at', { ascending: false })
      .limit(4)

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      attendancePercentage,
      recentClasses: recentClasses || [],
      recentSubjects: recentSubjects || [],
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
