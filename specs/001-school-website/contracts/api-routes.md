# API Routes Contract: Al-Noor Academy School Website

**Feature**: 001-school-website
**Date**: 2026-02-23
**Base URL**: `/api`

## Overview

All API routes follow RESTful conventions using Next.js 14 Route Handlers.

### Authentication
- Protected routes require valid JWT in HTTP-only cookie
- JWT contains: `{ userId, email, role }`
- Middleware validates token and extracts user info

### Response Format
```typescript
// Success
{ data: T, message?: string }

// Error
{ error: string, details?: Record<string, string[]> }
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `500` - Server Error

---

## Authentication Routes

### POST /api/auth/[...nextauth]
NextAuth.js handler for all auth operations.

**Handled Internally**:
- `POST /api/auth/signin` - Credential login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

---

## Public Content Routes

### GET /api/news
List published news articles.

**Auth**: None

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| category | string | - | Filter by category |
| search | string | - | Search in title/content |
| featured | boolean | - | Featured articles only |

**Response**:
```typescript
{
  data: {
    items: Array<{
      id: string
      title: string
      slug: string
      excerpt: string
      category: string
      coverImage: string | null
      publishedAt: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
```

### GET /api/news/[slug]
Get single news article by slug.

**Auth**: None

**Response**:
```typescript
{
  data: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    category: string
    coverImage: string | null
    author: string | null
    publishedAt: string
  }
}
```

### GET /api/events
List public events.

**Auth**: None

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| from | string | today | Start date (ISO) |
| to | string | - | End date (ISO) |
| upcoming | boolean | true | Future events only |

**Response**:
```typescript
{
  data: {
    items: Array<{
      id: string
      title: string
      description: string | null
      startDate: string
      endDate: string | null
      location: string | null
      category: string | null
      isAllDay: boolean
    }>
    pagination: { ... }
  }
}
```

### GET /api/staff
List public staff directory.

**Auth**: None

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | - | Search name/department |
| department | string | - | Filter by department |

**Response**:
```typescript
{
  data: Array<{
    id: string
    name: string
    email: string
    department: string
    designation: string
    image: string | null
  }>
}
```

### GET /api/staff/[id]
Get single staff member profile.

**Auth**: None

**Response**:
```typescript
{
  data: {
    id: string
    name: string
    email: string
    department: string
    designation: string
    bio: string | null
    image: string | null
    phone: string | null
  }
}
```

### GET /api/announcements
Get active announcements for homepage ticker.

**Auth**: None

**Response**:
```typescript
{
  data: Array<{
    id: string
    title: string
    content: string | null
    link: string | null
  }>
}
```

### GET /api/testimonials
Get active testimonials for homepage.

**Auth**: None

**Response**:
```typescript
{
  data: Array<{
    id: string
    name: string
    role: string
    content: string
    image: string | null
  }>
}
```

### GET /api/newsletters
List newsletter archive.

**Auth**: None

**Response**:
```typescript
{
  data: Array<{
    id: string
    title: string
    description: string | null
    fileUrl: string
    publishedAt: string
  }>
}
```

### GET /api/settings
Get public site settings.

**Auth**: None

**Response**:
```typescript
{
  data: {
    schoolName: string
    tagline: string
    stats: {
      students: number
      teachers: number
      years: number
      passRate: number
    }
    contact: {
      address: string
      phone: string
      email: string
      mapUrl: string
    }
    social: {
      facebook: string | null
      twitter: string | null
      instagram: string | null
      youtube: string | null
    }
    principal: {
      name: string
      title: string
      message: string
      image: string | null
    }
  }
}
```

---

## Contact Routes

### POST /api/contact
Submit contact form.

**Auth**: None

**Request Body**:
```typescript
{
  name: string      // Required, 1-100 chars
  email: string     // Required, valid email
  phone?: string    // Optional
  subject: string   // Required, 1-200 chars
  message: string   // Required, 1-2000 chars
}
```

**Response**:
```typescript
{
  data: { id: string },
  message: "Your message has been sent successfully"
}
```

**Side Effects**:
- Sends confirmation email to user
- Sends notification email to admin

---

## Application Routes

### POST /api/applications
Submit admission application.

**Auth**: None

**Request Body**:
```typescript
{
  // Student Info (Step 1)
  studentFirstName: string
  studentLastName: string
  studentDob: string      // ISO date
  studentGender: string   // "Male" | "Female"
  gradeApplying: string   // e.g., "Grade 5"
  previousSchool?: string

  // Guardian Info (Step 2)
  guardianFirstName: string
  guardianLastName: string
  guardianEmail: string
  guardianPhone: string
  guardianRelation: string  // "Father" | "Mother" | "Guardian"
  guardianOccupation?: string
  guardianAddress: string

  // Documents (Step 3)
  documents?: {
    birthCertificate?: string   // Cloudinary URL
    previousReport?: string     // Cloudinary URL
    photo?: string              // Cloudinary URL
  }
}
```

**Response**:
```typescript
{
  data: {
    id: string
    applicationNumber: string
    status: "PENDING"
  },
  message: "Application submitted successfully"
}
```

**Side Effects**:
- Sends confirmation email to guardian
- Creates notification for admin

### GET /api/applications/[number]
Check application status by application number.

**Auth**: None (status only, no details)

**Response**:
```typescript
{
  data: {
    applicationNumber: string
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED"
    submittedAt: string
  }
}
```

---

## File Upload Routes

### POST /api/upload
Get signed Cloudinary upload URL.

**Auth**: None (for application uploads)

**Request Body**:
```typescript
{
  folder: string    // "applications" | "profiles" | "news"
  fileType: string  // "image" | "document"
}
```

**Response**:
```typescript
{
  data: {
    uploadUrl: string
    publicId: string
    signature: string
    timestamp: number
    apiKey: string
  }
}
```

---

## Student Portal Routes

### GET /api/students/me
Get current student's profile.

**Auth**: Required (STUDENT role)

**Response**:
```typescript
{
  data: {
    id: string
    firstName: string
    lastName: string
    gradeLevel: string
    rollNumber: string
    profileImage: string | null
    email: string
  }
}
```

### GET /api/students/me/attendance
Get current student's attendance summary.

**Auth**: Required (STUDENT role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| from | string | term start | Start date |
| to | string | today | End date |

**Response**:
```typescript
{
  data: {
    summary: {
      present: number
      absent: number
      late: number
      excused: number
      total: number
      percentage: number
    }
    records: Array<{
      date: string
      status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
      className: string
    }>
  }
}
```

### GET /api/students/me/grades
Get current student's grades.

**Auth**: Required (STUDENT role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| term | string | current | Academic term |
| year | number | current | Academic year |

**Response**:
```typescript
{
  data: Array<{
    subject: string
    assessments: Array<{
      name: string
      score: number
      maxScore: number
      grade: string | null
    }>
    average: number
  }>
}
```

### GET /api/students/me/fees
Get current student's fee status.

**Auth**: Required (STUDENT role)

**Response**:
```typescript
{
  data: {
    pending: Array<{
      id: string
      description: string
      amount: number
      dueDate: string
      status: "PENDING" | "OVERDUE"
    }>
    paid: Array<{
      id: string
      description: string
      amount: number
      paidAt: string
    }>
    totalPending: number
    totalPaid: number
  }
}
```

---

## Parent Portal Routes

### GET /api/parents/me/children
Get parent's linked children.

**Auth**: Required (PARENT role)

**Response**:
```typescript
{
  data: Array<{
    id: string
    firstName: string
    lastName: string
    gradeLevel: string
    rollNumber: string
    profileImage: string | null
  }>
}
```

### GET /api/parents/me/children/[id]/attendance
Get specific child's attendance.

**Auth**: Required (PARENT role, must be linked to child)

**Response**: Same as student attendance

### GET /api/parents/me/children/[id]/grades
Get specific child's grades.

**Auth**: Required (PARENT role, must be linked to child)

**Response**: Same as student grades

### GET /api/parents/me/children/[id]/fees
Get specific child's fees.

**Auth**: Required (PARENT role, must be linked to child)

**Response**: Same as student fees

### GET /api/parents/me/notifications
Get parent's notifications.

**Auth**: Required (PARENT role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| unread | boolean | - | Unread only |

**Response**:
```typescript
{
  data: Array<{
    id: string
    title: string
    message: string
    type: string
    read: boolean
    createdAt: string
    link: string | null
  }>
}
```

### PATCH /api/parents/me/notifications/[id]
Mark notification as read.

**Auth**: Required (PARENT role)

**Request Body**:
```typescript
{ read: true }
```

---

## Teacher Portal Routes

### GET /api/teachers/me/classes
Get teacher's assigned classes.

**Auth**: Required (TEACHER role)

**Response**:
```typescript
{
  data: Array<{
    id: string
    name: string
    grade: string
    section: string
    subject: string
    studentCount: number
  }>
}
```

### GET /api/teachers/me/classes/[id]/students
Get students in a class.

**Auth**: Required (TEACHER role, must be assigned to class)

**Response**:
```typescript
{
  data: Array<{
    id: string
    rollNumber: string
    firstName: string
    lastName: string
    profileImage: string | null
  }>
}
```

### GET /api/teachers/me/classes/[id]/attendance
Get attendance records for a class.

**Auth**: Required (TEACHER role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| date | string | today | Specific date |

**Response**:
```typescript
{
  data: {
    date: string
    records: Array<{
      studentId: string
      studentName: string
      status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | null
    }>
  }
}
```

### POST /api/teachers/me/classes/[id]/attendance
Mark attendance for a class.

**Auth**: Required (TEACHER role)

**Request Body**:
```typescript
{
  date: string   // ISO date
  attendance: Array<{
    studentId: string
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
    remarks?: string
  }>
}
```

**Response**:
```typescript
{
  message: "Attendance saved successfully",
  data: { count: number }
}
```

### POST /api/teachers/me/classes/[id]/grades
Enter grades for a class.

**Auth**: Required (TEACHER role)

**Request Body**:
```typescript
{
  assessmentName: string
  term: string
  year: number
  maxScore: number
  grades: Array<{
    studentId: string
    score: number
    grade?: string
    remarks?: string
  }>
}
```

**Response**:
```typescript
{
  message: "Grades saved successfully",
  data: { count: number }
}
```

---

## Admin Portal Routes

### GET /api/admin/stats
Get dashboard statistics.

**Auth**: Required (ADMIN role)

**Response**:
```typescript
{
  data: {
    users: {
      students: number
      parents: number
      teachers: number
      admins: number
      total: number
    }
    applications: {
      pending: number
      approved: number
      rejected: number
      total: number
    }
    fees: {
      collected: number
      pending: number
      overdue: number
    }
  }
}
```

### GET /api/admin/applications
List all applications.

**Auth**: Required (ADMIN role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | - | Filter by status |
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |

**Response**:
```typescript
{
  data: {
    items: Array<{
      id: string
      applicationNumber: string
      studentName: string
      gradeApplying: string
      guardianEmail: string
      status: string
      createdAt: string
    }>
    pagination: { ... }
  }
}
```

### GET /api/admin/applications/[id]
Get application details.

**Auth**: Required (ADMIN role)

**Response**: Full application object

### PATCH /api/admin/applications/[id]
Update application status.

**Auth**: Required (ADMIN role)

**Request Body**:
```typescript
{
  status: "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED"
  notes?: string
}
```

**Side Effects**:
- Sends status update email to guardian

### GET /api/admin/users
List all users.

**Auth**: Required (ADMIN role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| role | string | - | Filter by role |
| search | string | - | Search by name/email |
| page | number | 1 | Page number |

**Response**:
```typescript
{
  data: {
    items: Array<{
      id: string
      email: string
      role: string
      name: string
      createdAt: string
    }>
    pagination: { ... }
  }
}
```

### GET /api/admin/fees
List all fees with summaries.

**Auth**: Required (ADMIN role)

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | - | Filter by status |
| studentId | string | - | Filter by student |

**Response**:
```typescript
{
  data: {
    summary: {
      totalCollected: number
      totalPending: number
      totalOverdue: number
    }
    items: Array<{
      id: string
      studentName: string
      description: string
      amount: number
      status: string
      dueDate: string
    }>
  }
}
```

### GET /api/admin/contacts
List contact form submissions.

**Auth**: Required (ADMIN role)

**Response**:
```typescript
{
  data: Array<{
    id: string
    name: string
    email: string
    subject: string
    status: string
    createdAt: string
  }>
}
```

---

## Payment Routes

### POST /api/fees/[id]/checkout
Create Stripe checkout session for a fee.

**Auth**: Required (STUDENT or PARENT role)

**Response**:
```typescript
{
  data: {
    checkoutUrl: string
    sessionId: string
  }
}
```

**Flow**:
1. Create Stripe Checkout session
2. Return checkout URL
3. User redirected to Stripe
4. Stripe webhook handles payment completion

### POST /api/webhooks/stripe
Handle Stripe webhook events.

**Auth**: Stripe signature verification

**Handled Events**:
- `checkout.session.completed` - Mark fee as paid
- `payment_intent.payment_failed` - Log failure

---

## Common Response Types

```typescript
interface PaginatedResponse<T> {
  data: {
    items: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface ErrorResponse {
  error: string
  details?: Record<string, string[]>
}
```
