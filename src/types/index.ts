// Re-export constants as types
export type {
  UserRole,
  FeeStatus,
  AttendanceStatus,
  ApplicationStatus,
  ContactStatus,
  NotificationType,
  NewsCategory,
  Language,
  GradeLevel,
} from "@/utils/constants"

// Auth types
export interface AuthUser {
  id: string
  email: string
  role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN"
  name?: string
}

// Student types
export interface Student {
  id: string
  userId: string
  firstName: string
  lastName: string
  gradeLevel: string
  rollNumber: string
  phone?: string
  profileImage?: string
  createdAt: Date
}

// Parent types
export interface Parent {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: Date
}

// Teacher types
export interface Teacher {
  id: string
  userId: string
  firstName: string
  lastName: string
  subject: string
  qualification?: string
  bio?: string
  profileImage?: string
  createdAt: Date
}

// Class types
export interface Class {
  id: string
  name: string
  grade: string
  section: string
  subject: string
  academicYear: string
  teacherId: string
}

// Grade (academic) types
export interface Grade {
  id: string
  studentId: string
  classId: string
  subject: string
  assessmentName: string
  score: number
  maxScore: number
  grade: string
  term: string
  year: number
  remarks?: string
  createdAt: Date
}

// Attendance types
export interface Attendance {
  id: string
  studentId: string
  classId: string
  date: Date
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  remarks?: string
  createdAt: Date
}

// Fee types
export interface Fee {
  id: string
  studentId: string
  amount: number
  description: string
  dueDate: Date
  status: "PENDING" | "PAID" | "OVERDUE" | "PARTIAL"
  paidAmount: number
  paidAt?: Date
  stripePaymentId?: string
  term?: string
  createdAt: Date
}

// News types
export interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category: string
  coverImage?: string
  author?: string
  published: boolean
  publishedAt?: Date
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// Event types
export interface Event {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
  category?: string
  isPublic: boolean
  isAllDay: boolean
  createdAt: Date
}

// Announcement types
export interface Announcement {
  id: string
  title: string
  content?: string
  link?: string
  isActive: boolean
  priority: number
  expiresAt?: Date
  createdAt: Date
}

// Testimonial types
export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  image?: string
  isActive: boolean
  order: number
  createdAt: Date
}

// Application types
export interface Application {
  id: string
  applicationNumber: string
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED"
  gradeApplying: string
  academicYear: string
  studentFirstName: string
  studentLastName: string
  studentDob: Date
  studentGender: string
  previousSchool?: string
  guardianFirstName: string
  guardianLastName: string
  guardianEmail: string
  guardianPhone: string
  guardianRelation: string
  guardianOccupation?: string
  guardianAddress: string
  documents?: Record<string, string>
  notes?: string
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Contact types
export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED"
  repliedAt?: Date
  createdAt: Date
}

// Notification types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "INFO" | "WARNING" | "SUCCESS" | "FEE" | "GRADE" | "ATTENDANCE"
  link?: string
  read: boolean
  createdAt: Date
}

// Staff types (public directory)
export interface Staff {
  id: string
  name: string
  email: string
  department: string
  designation: string
  bio?: string
  image?: string
  phone?: string
  order: number
  isPublic: boolean
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Site settings
export interface SiteSettings {
  schoolName: string
  schoolTagline: string
  schoolStats: {
    students: number
    teachers: number
    years: number
    passRate: number
  }
  contactInfo: {
    address: string
    phone: string
    email: string
    mapUrl: string
  }
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  principalMessage: {
    name: string
    title: string
    message: string
    image?: string
  }
}
