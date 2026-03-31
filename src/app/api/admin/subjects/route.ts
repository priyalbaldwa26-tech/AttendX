import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { name, code, sem, year } = await req.json()
    const { data: subject, error } = await supabase
      .from('subjects')
      .insert([{ name, code, sem, year }])
      .select()
      .single()

    if (error) throw error
    
    return NextResponse.json(subject)
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
  
  if (error) {
    console.error(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
  
  return NextResponse.json(subjects)
}
