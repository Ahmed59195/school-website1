// Application routes
export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  ACADEMICS: "/academics",
  ADMISSIONS: "/admissions",
  APPLY: "/admissions/apply",
  STUDENT_LIFE: "/student-life",
  NEWS: "/news",
  EVENTS: "/events",
  STAFF: "/staff",
  CONTACT: "/contact",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Portal routes
  PORTAL: {
    STUDENT: "/student",
    PARENT: "/parent",
    TEACHER: "/teacher",
    ADMIN: "/admin",
  },

  // API routes
  API: {
    AUTH: "/api/auth",
    APPLICATIONS: "/api/applications",
    ANNOUNCEMENTS: "/api/announcements",
    TESTIMONIALS: "/api/testimonials",
    SETTINGS: "/api/settings",
    NEWS: "/api/news",
    EVENTS: "/api/events",
    STAFF: "/api/staff",
    CONTACT: "/api/contact",
    UPLOAD: "/api/upload",
  },
} as const

// User roles
export const ROLES = {
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

// Fee status
export const FEE_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  PARTIAL: "PARTIAL",
} as const

export type FeeStatus = (typeof FEE_STATUS)[keyof typeof FEE_STATUS]

// Attendance status
export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  EXCUSED: "EXCUSED",
} as const

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS]

// Application status
export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  REVIEWING: "REVIEWING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  WAITLISTED: "WAITLISTED",
} as const

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]

// Contact status
export const CONTACT_STATUS = {
  NEW: "NEW",
  READ: "READ",
  REPLIED: "REPLIED",
  ARCHIVED: "ARCHIVED",
} as const

export type ContactStatus = (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS]

// Notification types
export const NOTIFICATION_TYPE = {
  INFO: "INFO",
  WARNING: "WARNING",
  SUCCESS: "SUCCESS",
  FEE: "FEE",
  GRADE: "GRADE",
  ATTENDANCE: "ATTENDANCE",
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

// News categories
export const NEWS_CATEGORIES = [
  "Announcements",
  "Academic",
  "Sports",
  "Events",
  "Achievements",
  "General",
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

// Supported languages
export const LANGUAGES = {
  en: "English",
  ur: "اردو",
} as const

export type Language = keyof typeof LANGUAGES

// School information
export const SCHOOL_INFO = {
  name: "Al-Noor Academy",
  tagline: "Empowering Minds, Shaping Futures",
  phone: "+92-XXX-XXXXXXX",
  email: "info@alnooracademy.edu.pk",
  address: "123 Education Street, Karachi, Pakistan",
} as const

// Grade levels
export const GRADE_LEVELS = [
  "Playgroup",
  "Nursery",
  "KG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const

export type GradeLevel = (typeof GRADE_LEVELS)[number]

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const
