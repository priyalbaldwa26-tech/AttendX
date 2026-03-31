import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'TEACHER') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const classId = searchParams.get('classId')

  if (!classId) {
    return new NextResponse('Class ID is required', { status: 400 })
  }

  try {
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        *,
        user:users(name, email)
      `)
      .eq('class_id', classId)
    
    if (error) throw error
    
    return NextResponse.json(students)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
