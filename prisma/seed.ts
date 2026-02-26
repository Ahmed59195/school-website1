import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL not set")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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

  // Create News with rich content
  await Promise.all([
    prisma.news.create({
      data: {
        title: "Annual Science Fair 2025 - A Spectacular Display of Innovation",
        slug: "annual-science-fair-2025",
        content: `Al-Noor Academy is proud to announce the Annual Science Fair 2025, scheduled for March 15-16. This year's theme is "Innovations for a Sustainable Future."

Students from grades 5-12 have been working tirelessly on their projects, exploring topics ranging from renewable energy solutions to artificial intelligence applications in agriculture. Our young scientists will present over 100 projects across various categories including:

- **Environmental Science**: Water purification systems, solar energy projects, and waste management solutions
- **Technology & Engineering**: Robotics, IoT devices, and smart home systems
- **Life Sciences**: Plant growth experiments, biodiversity studies, and health innovations
- **Mathematics & Data**: Statistical analysis projects and mathematical modeling

The fair will be inaugurated by Dr. Samina Qureshi, renowned scientist and former chairperson of the Pakistan Science Foundation. Parents, guardians, and community members are cordially invited to attend and witness our students' remarkable achievements.

**Event Details:**
- Date: March 15-16, 2025
- Time: 9:00 AM - 5:00 PM
- Venue: School Auditorium & Science Block

Light refreshments will be served. We look forward to seeing you there!`,
        excerpt: "Join us for the Annual Science Fair featuring over 100 student innovations focused on sustainability.",
        category: "Events",
        coverImage: "/images/news/science-fair.svg",
        published: true,
        publishedAt: new Date(),
        featured: true,
      },
    }),
    prisma.news.create({
      data: {
        title: "Board Exam Results - Al-Noor Academy Achieves 100% Pass Rate",
        slug: "board-exam-results-100-pass-rate",
        content: `We are thrilled to announce that Al-Noor Academy has achieved a remarkable 100% pass rate in this year's Matriculation and Intermediate board examinations!

**Outstanding Achievements:**
- 45 students secured A+ grades in Matriculation
- 38 students secured A+ grades in Intermediate
- 12 students ranked in the top 10 positions in the board
- Our school topped the district in overall performance

**Top Performers:**
1. **Ayesha Fatima** - 1st Position, Science Group (1089/1100)
2. **Hassan Ali** - 2nd Position, Science Group (1082/1100)
3. **Zainab Rizwan** - 3rd Position, Pre-Medical (1078/1100)

Principal Dr. Rashid Hussain congratulated all students and teachers, saying: "This achievement is a testament to the hard work of our students and the dedication of our faculty. At Al-Noor Academy, we believe in nurturing not just academic excellence but also character and values."

A special ceremony to honor the top performers will be held on March 20, 2025. Parents and students are invited to attend.

We extend our heartfelt congratulations to all our students and wish them the very best in their future endeavors!`,
        excerpt: "Al-Noor Academy achieves 100% pass rate with 12 students in top 10 board positions.",
        category: "Achievements",
        coverImage: "/images/news/graduation.svg",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 2),
        featured: true,
      },
    }),
    prisma.news.create({
      data: {
        title: "State-of-the-Art Computer Lab Inauguration",
        slug: "new-computer-lab-inauguration",
        content: `Al-Noor Academy has inaugurated a state-of-the-art computer lab equipped with the latest technology to enhance our students' digital learning experience.

**Lab Features:**
- 40 high-performance workstations with the latest Intel processors
- Dual monitor setups for advanced programming classes
- High-speed fiber internet connectivity (1 Gbps)
- Central air conditioning for optimal equipment performance
- Smart interactive whiteboard for demonstrations
- Professional-grade software suites including:
  - Microsoft Office 365
  - Adobe Creative Cloud
  - Python, Java, and C++ development environments
  - 3D modeling and animation software

**New Courses Available:**
- Introduction to Programming (Grades 5-8)
- Web Development (Grades 9-12)
- Graphic Design & Multimedia (Grades 8-12)
- Robotics & IoT (Grades 7-12)

The lab was inaugurated by Mr. Tariq Mahmood, CEO of TechVision Pakistan, who praised the school's commitment to preparing students for the digital age.

Classes in the new lab will begin from next Monday. Students are encouraged to sign up for the new elective courses through their class teachers.`,
        excerpt: "New computer lab with 40 workstations and professional software now open for students.",
        category: "Academic",
        coverImage: "/images/news/computer-lab.svg",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 5),
        featured: false,
      },
    }),
    prisma.news.create({
      data: {
        title: "Inter-School Debate Competition Victory",
        slug: "inter-school-debate-competition-victory",
        content: `Our school debate team has won the prestigious All-Pakistan Inter-School Debate Championship 2025!

The competition, held in Islamabad, featured 64 schools from across Pakistan. Our team of talented speakers demonstrated exceptional skills in argumentation, public speaking, and critical thinking.

**Winning Team:**
- Hamza Tariq (Grade 11) - Best Speaker Award
- Fatima Zahra (Grade 10) - Second Best Speaker
- Ali Raza (Grade 12) - Best Rebuttal Award
- Sana Malik (Grade 11) - Audience Choice Award

The team was coached by Mr. Farhan Ahmed, our English department head, who has been nurturing debaters for over a decade.

We congratulate our debate team and their coach for bringing this honor to Al-Noor Academy!`,
        excerpt: "Our debate team wins the All-Pakistan Inter-School Debate Championship 2025.",
        category: "Achievements",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 8),
        featured: false,
      },
    }),
    prisma.news.create({
      data: {
        title: "Annual Sports Day 2025 - Celebrating Athletic Excellence",
        slug: "annual-sports-day-2025",
        content: `Mark your calendars! Al-Noor Academy's Annual Sports Day will be held on February 28, 2025.

**Events Include:**
- 100m, 200m, and 400m sprints
- Long jump and high jump
- Shot put and discus throw
- Relay races (4x100m and 4x400m)
- Basketball and football tournaments
- Tug of war (inter-house competition)
- March past and drill display

**House Competition:**
Students will compete representing their houses:
- 🔴 Red House (Iqbal)
- 🔵 Blue House (Jinnah)
- 🟢 Green House (Liaquat)
- 🟡 Yellow House (Fatima)

Chief Guest: Mr. Jahangir Khan, legendary squash champion

All parents are welcome to attend and cheer for their children. Refreshments will be available.`,
        excerpt: "Join us for Annual Sports Day 2025 with track events, team sports, and house competitions.",
        category: "Events",
        coverImage: "/images/gallery/sports-day.svg",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 10),
        featured: true,
      },
    }),
    prisma.news.create({
      data: {
        title: "Library Gets 2,000 New Books",
        slug: "library-expansion-2000-new-books",
        content: `Our school library has received a significant upgrade with the addition of 2,000 new books across various genres and subjects.

**New Collections Include:**
- 500 fiction titles for young readers
- 300 classic literature works
- 400 science and technology reference books
- 200 Islamic studies and history books
- 300 encyclopedias and dictionaries
- 150 career guidance and self-improvement books
- 150 Urdu literature and poetry collections

The library now also features:
- A dedicated reading corner with comfortable seating
- Digital catalog system for easy book searches
- Extended hours (8 AM - 5 PM)
- Online book reservation system

We thank the Parent-Teacher Association and generous donors who made this expansion possible.`,
        excerpt: "School library expanded with 2,000 new books and modern facilities.",
        category: "Academic",
        coverImage: "/images/gallery/library.svg",
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 15),
        featured: false,
      },
    }),
  ])
  console.log("📰 Created 6 news articles with rich content")

  // Create Events with detailed descriptions
  await Promise.all([
    prisma.event.create({
      data: {
        title: "Parent-Teacher Meeting - Term 1",
        description: `Quarterly parent-teacher meeting to discuss student progress, academic performance, and areas for improvement.

**Agenda:**
- Review of Term 1 results
- Discussion of student strengths and areas for growth
- Setting goals for Term 2
- Q&A session with teachers

**Important:** Please bring your child's report card and any questions you may have.`,
        startDate: new Date(Date.now() + 86400000 * 7),
        endDate: new Date(Date.now() + 86400000 * 7 + 3600000 * 4),
        location: "School Auditorium & Individual Classrooms",
        category: "Meeting",
        isPublic: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Annual Sports Day 2025",
        description: `A day of athletic competitions, team sports, and house rivalries!

**Events:** Track & field, basketball, football, volleyball, cricket, and more.

**Houses competing:** Iqbal (Red), Jinnah (Blue), Liaquat (Green), Fatima (Yellow)

Parents are welcome to attend and cheer for their children!`,
        startDate: new Date(Date.now() + 86400000 * 14),
        location: "School Sports Complex",
        category: "Sports",
        isPublic: true,
        isAllDay: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Science Fair 2025",
        description: `Students from grades 5-12 will present their innovative science projects.

**Theme:** Innovations for a Sustainable Future

Over 100 projects covering environmental science, technology, life sciences, and mathematics.

Open to parents and community members.`,
        startDate: new Date(Date.now() + 86400000 * 21),
        endDate: new Date(Date.now() + 86400000 * 22),
        location: "Science Block & Auditorium",
        category: "Academic",
        isPublic: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Quran Recitation Competition",
        description: `Annual Quran recitation competition for all grades.

**Categories:**
- Hifz (Memorization)
- Tajweed (Proper pronunciation)
- Qiraat (Beautiful recitation)

Prizes and certificates for top performers in each category.`,
        startDate: new Date(Date.now() + 86400000 * 28),
        endDate: new Date(Date.now() + 86400000 * 28 + 3600000 * 5),
        location: "School Mosque",
        category: "Religious",
        isPublic: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Career Day 2025",
        description: `Professionals from various fields will share their experiences and guide students about career opportunities.

**Featured Speakers:**
- Engineers, Doctors, IT Professionals
- Entrepreneurs and Business Leaders
- Artists and Creative Professionals
- Government Officials

Open to students of grades 9-12 and their parents.`,
        startDate: new Date(Date.now() + 86400000 * 35),
        endDate: new Date(Date.now() + 86400000 * 35 + 3600000 * 6),
        location: "School Auditorium",
        category: "Career",
        isPublic: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Art & Culture Festival",
        description: `A celebration of creativity featuring student artwork, performances, and cultural displays.

**Highlights:**
- Art exhibition
- Drama performances
- Musical presentations
- Traditional dress show
- Food stalls`,
        startDate: new Date(Date.now() + 86400000 * 42),
        location: "School Grounds",
        category: "Cultural",
        isPublic: true,
        isAllDay: true,
      },
    }),
  ])
  console.log("📅 Created 6 events with detailed descriptions")

  // Create Announcements with detailed information
  await Promise.all([
    prisma.announcement.create({
      data: {
        title: "Admissions Open for 2025-26",
        content: "Applications are now being accepted for the academic year 2025-26. Limited seats available in all grades. Apply online or visit the admissions office.",
        isActive: true,
        priority: 1,
        expiresAt: new Date(Date.now() + 86400000 * 60),
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Fee Submission Deadline",
        content: "Last date for fee submission is the 15th of every month. Late payment charges of Rs. 500 will apply after the due date. Online payment is available through the parent portal.",
        isActive: true,
        priority: 2,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Parent-Teacher Meeting",
        content: "PTM scheduled for next Saturday. Please check your email for the time slot assigned to you. Bring your child's report card.",
        isActive: true,
        priority: 3,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Uniform Compliance",
        content: "Students must wear proper school uniform including correct shoes and accessories. Non-compliance will result in a warning letter to parents.",
        isActive: true,
        priority: 4,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "COVID-19 Safety Guidelines",
        content: "Hand sanitizers are available at all entrances. Students showing any symptoms should stay home. Parents must inform the school immediately of any positive cases.",
        isActive: true,
        priority: 5,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Bus Route Changes",
        content: "Bus routes 5 and 7 have been updated. Please check the transport office for new timings. Changes effective from Monday.",
        isActive: true,
        priority: 6,
      },
    }),
  ])
  console.log("📢 Created 6 announcements")

  // Create Testimonials with detailed feedback
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Dr. Saira Ahmed",
        role: "Parent - Cardiologist at National Hospital",
        content: "As a busy professional, I needed a school that would provide comprehensive care for my children. Al-Noor Academy has exceeded all my expectations. The teachers are not just educators but mentors who genuinely care about each child's growth. My daughter has flourished academically and socially. The regular parent-teacher communication keeps me informed and involved despite my hectic schedule.",
        image: "/images/staff/placeholder-female.svg",
        isActive: true,
        order: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Muhammad Ali Khan",
        role: "Alumni - Software Engineer at Google",
        content: "My journey from Al-Noor Academy to Google started with the strong foundation I received here. The values of hard work, integrity, and continuous learning that were instilled in me during my school years have been instrumental in my success. I still remember how my computer science teacher encouraged me to pursue programming. I'm proud to be an alumnus and regularly come back to mentor current students.",
        image: "/images/staff/placeholder-male.svg",
        isActive: true,
        order: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Fatima Zahra",
        role: "Parent - Business Owner",
        content: "What sets Al-Noor Academy apart is its perfect blend of academic excellence and moral education. My three children have all studied here, and I've seen how the school shapes not just their minds but their character. The Islamic values are taught in a way that is relevant and practical for modern life. The teachers are approachable and the administration is responsive to parent feedback.",
        image: "/images/staff/placeholder-female.svg",
        isActive: true,
        order: 3,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Ahmed Hassan",
        role: "Student - Grade 10",
        content: "I've been at Al-Noor Academy since grade 1, and these have been the best years of my life. The teachers make even difficult subjects interesting. I love the science lab experiments and the robotics club. My friends and I won the inter-school robotics competition last year! The sports facilities are great too - I'm on the school cricket team.",
        image: "/images/students/student-placeholder.svg",
        isActive: true,
        order: 4,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Eng. Khalid Mahmood",
        role: "Parent - Civil Engineer",
        content: "The infrastructure and facilities at Al-Noor Academy are impressive. As an engineer, I appreciate the attention to detail in the school's design - from the well-ventilated classrooms to the modern science labs. But what truly impresses me is the quality of education. Both my sons are excelling in mathematics and sciences.",
        image: "/images/staff/placeholder-male.svg",
        isActive: true,
        order: 5,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Ayesha Siddiqui",
        role: "Alumni - Medical Doctor",
        content: "Al-Noor Academy prepared me not just for board exams but for life. The biology and chemistry foundation I received here made medical college much easier. The teachers' dedication and the study habits I developed continue to help me in my medical career. I'm grateful for the strong base this school provided.",
        image: "/images/staff/placeholder-female.svg",
        isActive: true,
        order: 6,
      },
    }),
  ])
  console.log("💬 Created 6 detailed testimonials")

  // Create Staff Directory with detailed profiles
  await Promise.all([
    prisma.staff.create({
      data: {
        name: "Dr. Rashid Hussain",
        email: "principal@alnooracademy.edu.pk",
        phone: "+92-300-1234567",
        department: "Administration",
        designation: "Principal",
        bio: "Dr. Rashid Hussain has been leading Al-Noor Academy for the past 15 years with 25 years of total experience in education. He holds a Ph.D. in Educational Leadership from the University of Karachi and has been instrumental in transforming our institution into one of the leading schools in the region. Under his leadership, the school has achieved numerous accolades including the Best School Award from the Education Ministry for three consecutive years.",
        image: "/images/staff/principal.svg",
        order: 1,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mrs. Nadia Malik",
        email: "vp@alnooracademy.edu.pk",
        phone: "+92-300-2345678",
        department: "Administration",
        designation: "Vice Principal",
        bio: "Mrs. Nadia Malik oversees academic affairs and student development programs at Al-Noor Academy. With an M.Phil in Education and 18 years of teaching experience, she brings a wealth of knowledge to her role. She is passionate about innovative teaching methodologies and has introduced several successful programs including the Student Mentorship Initiative and the Academic Excellence Program.",
        image: "/images/staff/vice-principal.svg",
        order: 2,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mr. Kamran Shah",
        email: "admin@alnooracademy.edu.pk",
        phone: "+92-300-3456789",
        department: "Administration",
        designation: "Administrator",
        bio: "Mr. Kamran Shah manages school operations and administrative functions with efficiency and dedication. With an MBA in Operations Management, he ensures smooth day-to-day functioning of the institution. He has streamlined admission processes, improved facility management, and implemented digital systems for better administrative efficiency.",
        image: "/images/staff/placeholder-male.svg",
        order: 3,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mr. Ahmed Khan",
        email: "academics@alnooracademy.edu.pk",
        phone: "+92-300-4567890",
        department: "Academics",
        designation: "Head of Mathematics",
        bio: "Mr. Ahmed Khan leads the Mathematics department with 15 years of teaching experience. He holds an M.Sc. in Mathematics and B.Ed., specializing in making complex mathematical concepts accessible to students. His innovative teaching methods have consistently produced top performers in board examinations.",
        image: "/images/staff/placeholder-male.svg",
        order: 4,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mrs. Fatima Ali",
        email: "english@alnooracademy.edu.pk",
        phone: "+92-300-5678901",
        department: "Academics",
        designation: "Head of English",
        bio: "Mrs. Fatima Ali is the Head of English Department with an M.A. in English Literature from Punjab University. She is passionate about fostering a love for literature and effective communication skills in students. She runs the school's literary magazine and debate club.",
        image: "/images/staff/placeholder-female.svg",
        order: 5,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Dr. Muhammad Hassan",
        email: "science@alnooracademy.edu.pk",
        phone: "+92-300-6789012",
        department: "Academics",
        designation: "Head of Science",
        bio: "Dr. Muhammad Hassan leads the Science Department with a Ph.D. in Physics. He has published several research papers and brings real-world scientific research experience to the classroom. He organizes the annual Science Fair and mentors students for science olympiads.",
        image: "/images/staff/placeholder-male.svg",
        order: 6,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Ms. Sana Qureshi",
        email: "counselor@alnooracademy.edu.pk",
        phone: "+92-300-7890123",
        department: "Student Services",
        designation: "School Counselor",
        bio: "Ms. Sana Qureshi is our dedicated school counselor with an M.Sc. in Psychology. She provides academic guidance, career counseling, and emotional support to students. She has implemented peer counseling programs and conducts regular workshops on stress management and study skills.",
        image: "/images/staff/placeholder-female.svg",
        order: 7,
        isPublic: true,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mr. Imran Malik",
        email: "it@alnooracademy.edu.pk",
        phone: "+92-300-8901234",
        department: "Academics",
        designation: "Head of Computer Science",
        bio: "Mr. Imran Malik heads the Computer Science department with an M.Sc. in Computer Science. He has industry experience from leading tech companies and brings practical knowledge to the classroom. He has established the school's coding club and robotics program.",
        image: "/images/staff/placeholder-male.svg",
        order: 8,
        isPublic: true,
      },
    }),
  ])
  console.log("👥 Created 8 staff directory entries")

  // Create sample applications
  await Promise.all([
    prisma.application.create({
      data: {
        studentFirstName: "Ibrahim",
        studentLastName: "Khan",
        studentDob: new Date("2015-06-15"),
        studentGender: "Male",
        gradeApplying: "Grade 4",
        previousSchool: "City Public School",
        guardianFirstName: "Shahid",
        guardianLastName: "Khan",
        guardianRelation: "Father",
        guardianEmail: "shahid.khan@email.com",
        guardianPhone: "+92-300-1112233",
        guardianOccupation: "Business Executive",
        guardianAddress: "45-B, DHA Phase 5, Karachi",
        status: "PENDING",
      },
    }),
    prisma.application.create({
      data: {
        studentFirstName: "Amina",
        studentLastName: "Rizwan",
        studentDob: new Date("2014-09-22"),
        studentGender: "Female",
        gradeApplying: "Grade 5",
        previousSchool: "Beacon House School",
        guardianFirstName: "Rizwan",
        guardianLastName: "Ahmed",
        guardianRelation: "Father",
        guardianEmail: "rizwan.ahmed@email.com",
        guardianPhone: "+92-301-2223344",
        guardianOccupation: "Physician",
        guardianAddress: "123, Gulshan-e-Iqbal Block 13, Karachi",
        status: "REVIEWING",
        notes: "Strong academic record. Interview scheduled for next week.",
      },
    }),
    prisma.application.create({
      data: {
        studentFirstName: "Hamza",
        studentLastName: "Malik",
        studentDob: new Date("2016-03-10"),
        studentGender: "Male",
        gradeApplying: "Grade 3",
        previousSchool: "The City School",
        guardianFirstName: "Saba",
        guardianLastName: "Malik",
        guardianRelation: "Mother",
        guardianEmail: "saba.malik@email.com",
        guardianPhone: "+92-302-3334455",
        guardianOccupation: "Lawyer",
        guardianAddress: "78-C, Clifton Block 8, Karachi",
        status: "APPROVED",
        notes: "Excellent entrance test results. Admission confirmed for Grade 3.",
      },
    }),
  ])
  console.log("📝 Created 3 sample applications")

  // Create Site Settings with comprehensive information
  await prisma.siteSetting.create({
    data: {
      key: "school_info",
      value: {
        name: "Al-Noor Academy",
        tagline: "Empowering Minds, Shaping Futures",
        phone: "+92-42-35761234",
        email: "info@alnooracademy.edu.pk",
        admissionsEmail: "admissions@alnooracademy.edu.pk",
        address: "123 Education Street, Gulberg III, Lahore, Pakistan",
        postalCode: "54000",
        city: "Lahore",
        country: "Pakistan",
        foundedYear: 1999,
        principalName: "Dr. Rashid Hussain",
        logo: "/images/logo.svg",
        logoWhite: "/images/logo-white.svg",
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
        classrooms: 60,
        labs: 8,
        libraryBooks: 25000,
        sportsGrounds: 3,
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
        linkedin: "https://linkedin.com/school/alnooracademy",
        whatsapp: "+92-300-1234567",
      },
      description: "Social media links",
    },
  })

  await prisma.siteSetting.create({
    data: {
      key: "office_hours",
      value: {
        weekdays: "8:00 AM - 4:00 PM",
        saturday: "9:00 AM - 1:00 PM",
        sunday: "Closed",
        admissionsHours: "9:00 AM - 3:00 PM (Mon-Fri)",
      },
      description: "Office operating hours",
    },
  })

  await prisma.siteSetting.create({
    data: {
      key: "fee_structure",
      value: {
        admissionFee: 25000,
        securityDeposit: 15000,
        monthlyFee: {
          playgroup: 8000,
          nursery: 9000,
          prep: 10000,
          grade1to5: 12000,
          grade6to8: 14000,
          grade9to10: 16000,
          grade11to12: 18000,
        },
        transportFee: "Rs. 3,000 - 6,000 depending on distance",
      },
      description: "Fee structure information",
    },
  })
  console.log("⚙️ Created 5 site settings")

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
