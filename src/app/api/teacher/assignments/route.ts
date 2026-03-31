import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'TEACHER') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // We inner join the teacher table to filter by the logged-in user_id
    const { data: assignments, error } = await supabase
      .from('teacher_assignments')
      .select('*, class:classes(*), subject:subjects(*), teacher:teachers!inner(*)')
      .eq('teacher.user_id', session.user.id)
    
    if (error) {
      console.error("Supabase Error fetching assignments:", error.message)
      throw error
    }

    return NextResponse.json(assignments)
  } catch (error: any) {
    console.error("Assignments API Error:", error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
