import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clean existing data
  await prisma.notification.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.fee.deleteMany()
  await prisma.parentStudent.deleteMany()
  await prisma.class.deleteMany()
  await prisma.student.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.user.deleteMany()
  await prisma.news.deleteMany()
  await prisma.event.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.application.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.siteSetting.deleteMany()

  console.log("🧹 Cleaned existing data")

  // Hash password function
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12)
  }

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@alnooracademy.edu.pk",
      password: await hashPassword("Admin123!"),
      role: "ADMIN",
    },
  })
  console.log("👤 Created admin user")

  // Create Teachers
  const teacherPasswords = await Promise.all([
    hashPassword("Teacher123!"),
    hashPassword("Teacher123!"),
    hashPassword("Teacher123!"),
    hashPassword("Teacher123!"),
    hashPassword("Teacher123!"),
  ])

  const teachers = await Promise.all([
    prisma.user.create({
      data: {
        email: "teacher1@alnooracademy.edu.pk",
        password: teacherPasswords[0],
        role: "TEACHER",
        teacher: {
          create: {
            firstName: "Ahmed",
            lastName: "Khan",
            subject: "Mathematics",
            qualification: "M.Sc Mathematics, B.Ed",
            bio: "15 years of experience teaching mathematics to secondary students.",
          },
        },
      },
      include: { teacher: true },
    }),
    prisma.user.create({
      data: {
        email: "teacher2@alnooracademy.edu.pk",
        password: teacherPasswords[1],
        role: "TEACHER",
        teacher: {
          create: {
            firstName: "Fatima",
            lastName: "Ali",
            subject: "English",
            qualification: "M.A English Literature",
            bio: "Passionate about teaching English language and literature.",
          },
        },
      },
      include: { teacher: true },
    }),
    prisma.user.create({
      data: {
        email: "teacher3@alnooracademy.edu.pk",
        password: teacherPasswords[2],
        role: "TEACHER",
        teacher: {
          create: {
            firstName: "Muhammad",
            lastName: "Hassan",
            subject: "Science",
            qualification: "M.Sc Physics",
            bio: "Science educator with focus on practical learning.",
          },
        },
      },
      include: { teacher: true },
    }),
    prisma.user.create({
      data: {
        email: "teacher4@alnooracademy.edu.pk",
        password: teacherPasswords[3],
        role: "TEACHER",
        teacher: {
          create: {
            firstName: "Ayesha",
            lastName: "Siddiqui",
            subject: "Urdu",
            qualification: "M.A Urdu, B.Ed",
            bio: "Dedicated to preserving and teaching Urdu language and literature.",
          },
        },
      },
      include: { teacher: true },
    }),
    prisma.user.create({
      data: {
        email: "teacher5@alnooracademy.edu.pk",
        password: teacherPasswords[4],
        role: "TEACHER",
        teacher: {
          create: {
            firstName: "Imran",
            lastName: "Malik",
            subject: "Computer Science",
            qualification: "M.Sc Computer Science",
            bio: "Teaching programming and computer fundamentals to students.",
          },
        },
      },
      include: { teacher: true },
    }),
  ])
  console.log("👨‍🏫 Created 5 teachers")

  // Create Classes
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        name: "Mathematics - Grade 5A",
        grade: "Grade 5",
        section: "A",
        subject: "Mathematics",
        academicYear: "2025-2026",
        teacherId: teachers[0].teacher!.id,
      },
    }),
    prisma.class.create({
      data: {
        name: "English - Grade 5A",
        grade: "Grade 5",
        section: "A",
        subject: "English",
        academicYear: "2025-2026",
        teacherId: teachers[1].teacher!.id,
      },
    }),
    prisma.class.create({
      data: {
        name: "Science - Grade 6A",
        grade: "Grade 6",
        section: "A",
        subject: "Science",
        academicYear: "2025-2026",
        teacherId: teachers[2].teacher!.id,
      },
    }),
    prisma.class.create({
      data: {
        name: "Urdu - Grade 5A",
        grade: "Grade 5",
        section: "A",
        subject: "Urdu",
        academicYear: "2025-2026",
        teacherId: teachers[3].teacher!.id,
      },
    }),
    prisma.class.create({
      data: {
        name: "Computer Science - Grade 7A",
        grade: "Grade 7",
        section: "A",
        subject: "Computer Science",
        academicYear: "2025-2026",
        teacherId: teachers[4].teacher!.id,
      },
    }),
  ])
  console.log("📚 Created 5 classes")

  // Create Parents
  const parentPassword = await hashPassword("Parent123!")
  const parents = await Promise.all([
    prisma.user.create({
      data: {
        email: "parent1@example.com",
        password: parentPassword,
        role: "PARENT",
        parent: {
          create: {
            firstName: "Khalid",
            lastName: "Mahmood",
            phone: "+92-300-1234567",
            occupation: "Engineer",
          },
        },
      },
      include: { parent: true },
    }),
    prisma.user.create({
      data: {
        email: "parent2@example.com",
        password: parentPassword,
        role: "PARENT",
        parent: {
          create: {
            firstName: "Sadia",
            lastName: "Ahmed",
            phone: "+92-301-2345678",
            occupation: "Doctor",
          },
        },
      },
      include: { parent: true },
    }),
    prisma.user.create({
      data: {
        email: "parent3@example.com",
        password: parentPassword,
        role: "PARENT",
        parent: {
          create: {
            firstName: "Asif",
            lastName: "Raza",
            phone: "+92-302-3456789",
            occupation: "Business Owner",
          },
        },
      },
      include: { parent: true },
    }),
  ])
  console.log("👨‍👩‍👧 Created 3 parents")

  // Create Students
  const studentPassword = await hashPassword("Student123!")
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: "student1@alnooracademy.edu.pk",
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            firstName: "Ali",
            lastName: "Mahmood",
            gradeLevel: "Grade 5",
            rollNumber: "2025-001",
            dateOfBirth: new Date("2014-03-15"),
            phone: "+92-300-1111111",
          },
        },
      },
      include: { student: true },
    }),
    prisma.user.create({
      data: {
        email: "student2@alnooracademy.edu.pk",
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            firstName: "Sara",
            lastName: "Mahmood",
            gradeLevel: "Grade 6",
            rollNumber: "2025-002",
            dateOfBirth: new Date("2013-07-20"),
            phone: "+92-300-2222222",
          },
        },
      },
      include: { student: true },
    }),
    prisma.user.create({
      data: {
        email: "student3@alnooracademy.edu.pk",
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            firstName: "Hassan",
            lastName: "Ahmed",
            gradeLevel: "Grade 5",
            rollNumber: "2025-003",
            dateOfBirth: new Date("2014-01-10"),
            phone: "+92-301-3333333",
          },
        },
      },
      include: { student: true },
    }),
    prisma.user.create({
      data: {
        email: "student4@alnooracademy.edu.pk",
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            firstName: "Zainab",
            lastName: "Raza",
            gradeLevel: "Grade 7",
            rollNumber: "2025-004",
            dateOfBirth: new Date("2012-11-25"),
            phone: "+92-302-4444444",
          },
        },
      },
      include: { student: true },
    }),
    prisma.user.create({
      data: {
        email: "student5@alnooracademy.edu.pk",
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            firstName: "Usman",
            lastName: "Raza",
            gradeLevel: "Grade 5",
            rollNumber: "2025-005",
            dateOfBirth: new Date("2014-05-08"),
            phone: "+92-302-5555555",
          },
        },
      },
      include: { student: true },
    }),
  ])
  console.log("🎓 Created 5 students")

  // Link Parents to Students
  await Promise.all([
    prisma.parentStudent.create({
      data: {
        parentId: parents[0].parent!.id,
        studentId: students[0].student!.id,
        relationship: "Father",
      },
    }),
    prisma.parentStudent.create({
      data: {
        parentId: parents[0].parent!.id,
        studentId: students[1].student!.id,
        relationship: "Father",
      },
    }),
    prisma.parentStudent.create({
      data: {
        parentId: parents[1].parent!.id,
        studentId: students[2].student!.id,
        relationship: "Mother",
      },
    }),
    prisma.parentStudent.create({
      data: {
        parentId: parents[2].parent!.id,
        studentId: students[3].student!.id,
        relationship: "Father",
      },
    }),
    prisma.parentStudent.create({
      data: {
        parentId: parents[2].parent!.id,
        studentId: students[4].student!.id,
        relationship: "Father",
      },
    }),
  ])
  console.log("🔗 Linked parents to students")

  // Create Grades
  await Promise.all([
    prisma.grade.create({
      data: {
        studentId: students[0].student!.id,
        classId: classes[0].id,
        subject: "Mathematics",
        assessmentName: "Mid-Term Exam",
        score: 85,
        maxScore: 100,
        grade: "A",
        term: "Term 1",
        year: 2025,
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[0].student!.id,
        classId: classes[1].id,
        subject: "English",
        assessmentName: "Mid-Term Exam",
        score: 78,
        maxScore: 100,
        grade: "B+",
        term: "Term 1",
        year: 2025,
      },
    }),
    prisma.grade.create({
      data: {
        studentId: students[2].student!.id,
        classId: classes[0].id,
        subject: "Mathematics",
        assessmentName: "Mid-Term Exam",
        score: 92,
        maxScore: 100,
        grade: "A+",
        term: "Term 1",
        year: 2025,
      },
    }),
  ])
  console.log("📝 Created grades")

  // Create Attendance Records
  const today = new Date()
  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    await Promise.all([
      prisma.attendance.create({
        data: {
          studentId: students[0].student!.id,
          classId: classes[0].id,
          date,
          status: i === 2 ? "ABSENT" : "PRESENT",
        },
      }),
      prisma.attendance.create({
        data: {
          studentId: students[2].student!.id,
          classId: classes[0].id,
          date,
          status: i === 4 ? "LATE" : "PRESENT",
        },
      }),
    ])
  }
  console.log("📋 Created attendance records")

  // Create Fees
  await Promise.all([
    prisma.fee.create({
      data: {
        studentId: students[0].student!.id,
        amount: 15000,
        description: "Tuition Fee - January 2025",
        dueDate: new Date("2025-01-15"),
        status: "PAID",
        paidAmount: 15000,
        paidAt: new Date("2025-01-10"),
        term: "Term 1",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: students[0].student!.id,
        amount: 15000,
        description: "Tuition Fee - February 2025",
        dueDate: new Date("2025-02-15"),
        status: "PENDING",
        paidAmount: 0,
        term: "Term 1",
      },
    }),
    prisma.fee.create({
      data: {
        studentId: students[2].student!.id,
        amount: 15000,
        description: "Tuition Fee - January 2025",
        dueDate: new Date("2025-01-15"),
        status: "OVERDUE",
        paidAmount: 0,
        term: "Term 1",
      },
    }),
  ])
  console.log("💰 Created fee records")

  // Create News
  await Promise.all([
    prisma.news.create({
      data: {
        title: "Annual Science Fair 2025",
        slug: "annual-science-fair-2025",
        content: "Al-Noor Academy is proud to announce the Annual Science Fair 2025. Students from all grades will showcase their innovative projects. Parents and community members are welcome to attend.",
        excerpt: "Join us for the Annual Science Fair featuring student innovations.",
        category: "Events",
        published: true,
        publishedAt: new Date(),
        featured: true,
      },
    }),
    prisma.news.create({
      data: {
        title: "Board Exam Results - 100% Pass Rate",
        slug: "board-exam-results-100-pass-rate",
        content: "We are thrilled to announce that Al-Noor Academy has achieved a 100% pass rate in this year's board examinations. Congratulations to all our students and teachers!",
        excerpt: "Al-Noor Academy achieves 100% pass rate in board exams.",
        category: "Achievements",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 2),
        featured: true,
      },
    }),
    prisma.news.create({
      data: {
        title: "New Computer Lab Inauguration",
        slug: "new-computer-lab-inauguration",
        content: "Al-Noor Academy has inaugurated a state-of-the-art computer lab equipped with the latest technology to enhance our students' digital learning experience.",
        excerpt: "New computer lab with latest technology now open.",
        category: "Academic",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 5),
      },
    }),
  ])
  console.log("📰 Created news articles")

  // Create Events
  await Promise.all([
    prisma.event.create({
      data: {
        title: "Parent-Teacher Meeting",
        description: "Quarterly parent-teacher meeting to discuss student progress.",
        startDate: new Date(Date.now() + 86400000 * 7),
        endDate: new Date(Date.now() + 86400000 * 7 + 3600000 * 3),
        location: "School Auditorium",
        category: "Meeting",
        isPublic: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Sports Day",
        description: "Annual sports day with various athletic competitions.",
        startDate: new Date(Date.now() + 86400000 * 14),
        location: "School Ground",
        category: "Sports",
        isPublic: true,
        isAllDay: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Science Exhibition",
        description: "Students will present their science projects.",
        startDate: new Date(Date.now() + 86400000 * 21),
        endDate: new Date(Date.now() + 86400000 * 21 + 3600000 * 4),
        location: "Science Block",
        category: "Academic",
        isPublic: true,
      },
    }),
  ])
  console.log("📅 Created events")

  // Create Announcements
  await Promise.all([
    prisma.announcement.create({
      data: {
        title: "Winter Break Schedule",
        content: "School will be closed from December 20 to January 5 for winter break.",
        isActive: true,
        priority: 1,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Fee Submission Reminder",
        content: "Please submit pending fees before the 15th of this month.",
        isActive: true,
        priority: 2,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Uniform Guidelines",
        content: "All students must wear proper school uniform from Monday.",
        isActive: true,
        priority: 3,
      },
    }),
  ])
  console.log("📢 Created announcements")

  // Create Testimonials
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Sarah Ahmed",
        role: "Parent",
        content: "Al-Noor Academy has transformed my child's learning experience. The teachers are dedicated and the environment is nurturing.",
        isActive: true,
        order: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Muhammad Ali",
        role: "Alumni",
        content: "The values and education I received at Al-Noor Academy have been instrumental in my success. I'm proud to be an alumnus.",
        isActive: true,
        order: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Fatima Khan",
        role: "Parent",
        content: "The school's focus on both academic excellence and character building makes it stand out. Highly recommended!",
        isActive: true,
        order: 3,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Ahmed Hassan",
        role: "Student",
        content: "I love coming to school every day. The teachers make learning fun and there are so many activities to participate in.",
        isActive: true,
        order: 4,
      },
    }),
  ])
  console.log("💬 Created testimonials")

  // Create Staff Directory
  await Promise.all([
    prisma.staff.create({
      data: {
        name: "Dr. Rashid Hussain",
        email: "principal@alnooracademy.edu.pk",
        department: "Administration",
        designation: "Principal",
        bio: "Leading Al-Noor Academy with 25 years of experience in education.",
        order: 1,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mrs. Nadia Malik",
        email: "vp@alnooracademy.edu.pk",
        department: "Administration",
        designation: "Vice Principal",
        bio: "Overseeing academic affairs and student development programs.",
        order: 2,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mr. Kamran Shah",
        email: "admin@alnooracademy.edu.pk",
        department: "Administration",
        designation: "Administrator",
        bio: "Managing school operations and administrative functions.",
        order: 3,
        isPublic: true,
      },
    }),
  ])
  console.log("👥 Created staff directory entries")

  // Create Site Settings
  await prisma.siteSetting.create({
    data: {
      key: "school_info",
      value: {
        name: "Al-Noor Academy",
        tagline: "Empowering Minds, Shaping Futures",
        phone: "+92-21-1234567",
        email: "info@alnooracademy.edu.pk",
        address: "123 Education Street, Karachi, Pakistan",
      },
      description: "Basic school information",
    },
  })

  await prisma.siteSetting.create({
    data: {
      key: "school_stats",
      value: {
        students: 1200,
        teachers: 80,
        years: 25,
        passRate: 98,
      },
      description: "School statistics for homepage",
    },
  })

  await prisma.siteSetting.create({
    data: {
      key: "social_links",
      value: {
        facebook: "https://facebook.com/alnooracademy",
        twitter: "https://twitter.com/alnooracademy",
        instagram: "https://instagram.com/alnooracademy",
        youtube: "https://youtube.com/alnooracademy",
      },
      description: "Social media links",
    },
  })
  console.log("⚙️ Created site settings")

  console.log("✅ Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
