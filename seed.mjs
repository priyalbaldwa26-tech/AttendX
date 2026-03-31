import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('Seeding initial data...')

  try {
    const password = await bcrypt.hash('admin123', 10)
    const teacherPassword = await bcrypt.hash('teacher123', 10)
    const studentPassword = await bcrypt.hash('student123', 10)

    // 1. Create Users
    const usersToSeed = [
      { name: 'Admin User', email: 'admin@college.edu', password: password, role: 'ADMIN' },
      { name: 'Teacher User', email: 'teacher@college.edu', password: teacherPassword, role: 'TEACHER' },
      { name: 'Student User', email: 'student1@college.edu', password: studentPassword, role: 'STUDENT' },
    ]

    const seededUsers = []
    for (const u of usersToSeed) {
      const { data: existing } = await supabase.from('users').select('*').eq('email', u.email).single()
      if (existing) {
        seededUsers.push(existing)
        console.log(`User ${u.email} already exists.`)
      } else {
        const { data: neu, error } = await supabase.from('users').insert(u).select().single()
        if (error) throw error
        seededUsers.push(neu)
        console.log(`User ${u.email} created.`)
      }
    }

    const admin = seededUsers.find(u => u.role === 'ADMIN')
    const teacherUser = seededUsers.find(u => u.role === 'TEACHER')
    const studentUser = seededUsers.find(u => u.role === 'STUDENT')

    // 2. Create a Class
    let classData;
    const { data: existingClass } = await supabase.from('classes').select('*').eq('name', 'B.Tech CS A').single()
    if (existingClass) {
      classData = existingClass
      console.log('Class already exists.')
    } else {
      const { data: neuClass, error: classError } = await supabase
        .from('classes')
        .insert({ name: 'B.Tech CS A', year: '2024-25', department: 'Computer Science' })
        .select()
        .single()
      if (classError) throw classError
      classData = neuClass
      console.log('Class created.')
    }

    // 3. Create a Subject
    let subjectData;
    const { data: existingSubject } = await supabase.from('subjects').select('*').eq('code', 'CS101').single()
    if (existingSubject) {
      subjectData = existingSubject
      console.log('Subject already exists.')
    } else {
      const { data: neuSub, error: subjectError } = await supabase
        .from('subjects')
        .insert({ name: 'Data Structures', code: 'CS101', department: 'Computer Science' })
        .select()
        .single()
      if (subjectError) throw subjectError
      subjectData = neuSub
      console.log('Subject created.')
    }

    // 4. Create Teacher Profile
    let teacherProfile;
    const { data: existingTP } = await supabase.from('teachers').select('*').eq('user_id', teacherUser.id).single()
    if (existingTP) {
      teacherProfile = existingTP
      console.log('Teacher profile already exists.')
    } else {
      const { data: neuTP, error: teacherProfileError } = await supabase
        .from('teachers')
        .insert({ user_id: teacherUser.id, teacher_id: 'T1001' })
        .select()
        .single()
      if (teacherProfileError) throw teacherProfileError
      teacherProfile = neuTP
      console.log('Teacher profile created.')
    }

    // 5. Create Student Profile
    let studentProfile;
    const { data: existingSP } = await supabase.from('students').select('*').eq('user_id', studentUser.id).single()
    if (existingSP) {
      studentProfile = existingSP
      console.log('Student profile already exists.')
    } else {
      const { data: neuSP, error: studentProfileError } = await supabase
        .from('students')
        .insert({ user_id: studentUser.id, student_id: 'S1001', class_id: classData.id })
        .select()
        .single()
      if (studentProfileError) throw studentProfileError
      studentProfile = neuSP
      console.log('Student profile created.')
    }

    // 6. Create Teacher Assignment
    const { data: existingTA } = await supabase.from('teacher_assignments').select('*')
      .eq('teacher_id', teacherProfile.id)
      .eq('class_id', classData.id)
      .eq('subject_id', subjectData.id)
      .single()
    if (existingTA) {
      console.log('Teacher assignment already exists.')
    } else {
      const { error: assignmentError } = await supabase
        .from('teacher_assignments')
        .insert({ 
          teacher_id: teacherProfile.id, 
          class_id: classData.id, 
          subject_id: subjectData.id, 
          year: '2024-25' 
        })
      if (assignmentError) throw assignmentError
      console.log('Teacher assignment created.')
    }

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
  }
}

seed()
