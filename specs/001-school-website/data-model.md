# Data Model: Al-Noor Academy School Website

**Feature**: 001-school-website
**Date**: 2026-02-23
**Database**: PostgreSQL via Prisma ORM v7

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Student   │       │   Parent    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │──┐    │ id          │       │ id          │
│ email       │  │    │ userId      │───────│ userId      │
│ password    │  │    │ firstName   │       │ firstName   │
│ role        │  └───►│ lastName    │◄──────│ lastName    │
│ createdAt   │       │ gradeLevel  │   N:M │ phone       │
│ updatedAt   │       │ rollNumber  │       │ createdAt   │
└─────────────┘       │ phone       │       └─────────────┘
      │               │ profileImage│              │
      │               │ createdAt   │              │
      │               └─────────────┘              │
      │                     │                      │
      │                     │                      │
      ▼                     ▼                      │
┌─────────────┐       ┌─────────────┐              │
│   Teacher   │       │ParentStudent│◄─────────────┘
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ userId      │       │ parentId    │
│ firstName   │       │ studentId   │
│ lastName    │       └─────────────┘
│ subject     │
│ qualification│
│ bio         │             ┌─────────────┐
│ profileImage│             │    Class    │
│ createdAt   │────────────►├─────────────┤
└─────────────┘      1:N    │ id          │
                            │ name        │
                            │ grade       │
                            │ section     │
                            │ teacherId   │
                            └─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
              ┌─────────────┐             ┌─────────────┐
              │    Grade    │             │ Attendance  │
              ├─────────────┤             ├─────────────┤
              │ id          │             │ id          │
              │ studentId   │             │ studentId   │
              │ classId     │             │ classId     │
              │ subject     │             │ date        │
              │ score       │             │ status      │
              │ grade       │             │ createdAt   │
              │ term        │             └─────────────┘
              │ year        │
              │ createdAt   │
              └─────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     Fee     │    │    Event    │    │    News     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id          │    │ id          │    │ id          │
│ studentId   │    │ title       │    │ title       │
│ amount      │    │ description │    │ slug        │
│ description │    │ startDate   │    │ content     │
│ dueDate     │    │ endDate     │    │ excerpt     │
│ status      │    │ location    │    │ category    │
│ paidAt      │    │ isPublic    │    │ coverImage  │
│ stripeId    │    │ createdAt   │    │ published   │
│ createdAt   │    └─────────────┘    │ publishedAt │
└─────────────┘                       │ createdAt   │
                                      │ updatedAt   │
                                      └─────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Application │    │    Staff    │    │ Testimonial │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id          │    │ id          │    │ id          │
│ studentInfo │    │ name        │    │ name        │
│ parentInfo  │    │ email       │    │ role        │
│ documents   │    │ department  │    │ content     │
│ status      │    │ designation │    │ image       │
│ createdAt   │    │ bio         │    │ isActive    │
│ updatedAt   │    │ image       │    │ createdAt   │
└─────────────┘    │ order       │    └─────────────┘
                   │ isPublic    │
                   │ createdAt   │    ┌─────────────┐
                   └─────────────┘    │Announcement │
                                      ├─────────────┤
┌─────────────┐    ┌─────────────┐    │ id          │
│   Contact   │    │ Newsletter  │    │ title       │
├─────────────┤    ├─────────────┤    │ content     │
│ id          │    │ id          │    │ isActive    │
│ name        │    │ title       │    │ expiresAt   │
│ email       │    │ fileUrl     │    │ createdAt   │
│ subject     │    │ publishedAt │    └─────────────┘
│ message     │    │ createdAt   │
│ status      │    └─────────────┘
│ createdAt   │
└─────────────┘

┌─────────────┐
│Notification │
├─────────────┤
│ id          │
│ userId      │
│ title       │
│ message     │
│ type        │
│ read        │
│ createdAt   │
└─────────────┘
```

## Entity Definitions

### Core Authentication

#### User
The base authentication entity for all system users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| email | String | Unique, Required | Login email |
| password | String | Required | Bcrypt hashed |
| role | Enum | Required | STUDENT, PARENT, TEACHER, ADMIN |
| createdAt | DateTime | Default: now() | Account creation |
| updatedAt | DateTime | Auto-update | Last modification |

**Relations**: One-to-one with Student, Parent, or Teacher based on role

**Validation Rules**:
- Email: Valid email format, max 255 chars
- Password: Min 8 chars, requires uppercase, lowercase, number
- Role: Must be valid enum value

### Student Management

#### Student
Enrolled student profile linked to User account.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| userId | String | FK, Unique | Link to User |
| firstName | String | Required, 1-50 chars | Student first name |
| lastName | String | Required, 1-50 chars | Student last name |
| gradeLevel | String | Required | Current grade (e.g., "Grade 5") |
| rollNumber | String | Unique, Required | School roll number |
| dateOfBirth | DateTime | Optional | Student DOB |
| phone | String | Optional | Contact number |
| address | String | Optional | Home address |
| profileImage | String | Optional | Cloudinary URL |
| createdAt | DateTime | Default: now() | Record creation |

**Relations**:
- Belongs to User (1:1)
- Has many Grades
- Has many Fees
- Has many Attendance records
- Has many Parents (via ParentStudent)

#### Parent
Parent/guardian profile linked to User account.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| userId | String | FK, Unique | Link to User |
| firstName | String | Required, 1-50 chars | Parent first name |
| lastName | String | Required, 1-50 chars | Parent last name |
| phone | String | Optional | Contact number |
| occupation | String | Optional | Job title |
| createdAt | DateTime | Default: now() | Record creation |

**Relations**:
- Belongs to User (1:1)
- Has many Students (via ParentStudent)

#### ParentStudent
Junction table for parent-student relationships.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| parentId | String | FK, Required | Link to Parent |
| studentId | String | FK, Required | Link to Student |
| relationship | String | Optional | "Father", "Mother", "Guardian" |

**Constraints**: Unique composite (parentId, studentId)

### Staff Management

#### Teacher
Teacher profile linked to User account.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| userId | String | FK, Unique | Link to User |
| firstName | String | Required, 1-50 chars | Teacher first name |
| lastName | String | Required, 1-50 chars | Teacher last name |
| subject | String | Required | Primary subject |
| qualification | String | Optional | Degrees/certifications |
| bio | String | Optional | Biography text |
| profileImage | String | Optional | Cloudinary URL |
| createdAt | DateTime | Default: now() | Record creation |

**Relations**:
- Belongs to User (1:1)
- Has many Classes

#### Staff
Public staff directory entry (non-authenticated).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| name | String | Required, 1-100 chars | Full name |
| email | String | Required | Contact email |
| department | String | Required | Department name |
| designation | String | Required | Job title |
| bio | String | Optional | Biography |
| image | String | Optional | Cloudinary URL |
| phone | String | Optional | Contact number |
| order | Int | Default: 0 | Display order |
| isPublic | Boolean | Default: true | Show in directory |
| createdAt | DateTime | Default: now() | Record creation |

### Academic Records

#### Class
Class/section for organizing students and teachers.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| name | String | Required | e.g., "Mathematics" |
| grade | String | Required | e.g., "Grade 5" |
| section | String | Required | e.g., "A" |
| subject | String | Required | Subject taught |
| academicYear | String | Required | e.g., "2025-2026" |
| teacherId | String | FK, Required | Assigned teacher |

**Relations**:
- Belongs to Teacher
- Has many Grades
- Has many Attendance records

#### Grade
Academic grade/score for a student.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| studentId | String | FK, Required | Link to Student |
| classId | String | FK, Required | Link to Class |
| subject | String | Required | Subject name |
| assessmentName | String | Required | e.g., "Mid-term Exam" |
| score | Float | Required, 0-100 | Numeric score |
| maxScore | Float | Default: 100 | Maximum possible |
| grade | String | Optional | Letter grade (A, B, C, etc.) |
| term | String | Required | e.g., "Term 1" |
| year | Int | Required | Academic year |
| remarks | String | Optional | Teacher comments |
| createdAt | DateTime | Default: now() | Record creation |

**Relations**:
- Belongs to Student
- Belongs to Class

#### Attendance
Daily attendance record per student per class.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| studentId | String | FK, Required | Link to Student |
| classId | String | FK, Required | Link to Class |
| date | DateTime | Required | Attendance date |
| status | Enum | Required | PRESENT, ABSENT, LATE, EXCUSED |
| remarks | String | Optional | Notes |
| createdAt | DateTime | Default: now() | Record creation |

**Constraints**: Unique composite (studentId, classId, date)

**Relations**:
- Belongs to Student
- Belongs to Class

### Financial Records

#### Fee
Fee record for student tuition and other charges.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| studentId | String | FK, Required | Link to Student |
| amount | Float | Required, > 0 | Amount in PKR |
| description | String | Required | Fee type/description |
| dueDate | DateTime | Required | Payment deadline |
| status | Enum | Default: PENDING | PENDING, PAID, OVERDUE, PARTIAL |
| paidAmount | Float | Default: 0 | Amount paid |
| paidAt | DateTime | Optional | Payment timestamp |
| stripePaymentId | String | Optional | Stripe payment ID |
| stripeSessionId | String | Optional | Checkout session ID |
| term | String | Optional | Academic term |
| createdAt | DateTime | Default: now() | Record creation |

**Relations**:
- Belongs to Student

### Content Management

#### News
News articles for the school website.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| title | String | Required, 1-200 chars | Article title |
| slug | String | Unique, Required | URL-friendly slug |
| content | String | Required | Full article (Markdown) |
| excerpt | String | Optional, max 500 chars | Short summary |
| category | String | Required | News category |
| coverImage | String | Optional | Cloudinary URL |
| author | String | Optional | Author name |
| published | Boolean | Default: false | Publication status |
| publishedAt | DateTime | Optional | Publication date |
| featured | Boolean | Default: false | Show on homepage |
| createdAt | DateTime | Default: now() | Record creation |
| updatedAt | DateTime | Auto-update | Last modification |

**Categories**: Announcements, Academic, Sports, Events, Achievements, General

#### Event
School events and calendar items.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| title | String | Required, 1-200 chars | Event title |
| description | String | Optional | Event details |
| startDate | DateTime | Required | Event start |
| endDate | DateTime | Optional | Event end |
| location | String | Optional | Event venue |
| category | String | Optional | Event type |
| isPublic | Boolean | Default: true | Show on public site |
| isAllDay | Boolean | Default: false | All-day event |
| createdAt | DateTime | Default: now() | Record creation |

#### Announcement
Homepage ticker announcements.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| title | String | Required, 1-100 chars | Short title |
| content | String | Optional, max 300 chars | Brief content |
| link | String | Optional | URL to full content |
| isActive | Boolean | Default: true | Currently displayed |
| priority | Int | Default: 0 | Display order |
| expiresAt | DateTime | Optional | Auto-hide after |
| createdAt | DateTime | Default: now() | Record creation |

#### Testimonial
Parent/student testimonials for homepage.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| name | String | Required, 1-100 chars | Person's name |
| role | String | Required | "Parent", "Student", "Alumni" |
| content | String | Required, max 500 chars | Quote text |
| image | String | Optional | Person's photo |
| isActive | Boolean | Default: true | Currently displayed |
| order | Int | Default: 0 | Display order |
| createdAt | DateTime | Default: now() | Record creation |

#### Newsletter
Downloadable newsletter archive.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| title | String | Required, 1-200 chars | Newsletter title |
| description | String | Optional | Brief description |
| fileUrl | String | Required | Cloudinary PDF URL |
| publishedAt | DateTime | Required | Publication date |
| createdAt | DateTime | Default: now() | Record creation |

### Applications

#### Application
Admission application submissions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| applicationNumber | String | Unique, Required | Auto-generated |
| status | Enum | Default: PENDING | PENDING, REVIEWING, APPROVED, REJECTED, WAITLISTED |
| gradeApplying | String | Required | Target grade level |
| academicYear | String | Required | Year applying for |
| studentFirstName | String | Required | Applicant first name |
| studentLastName | String | Required | Applicant last name |
| studentDob | DateTime | Required | Date of birth |
| studentGender | String | Required | Gender |
| previousSchool | String | Optional | Previous school name |
| guardianFirstName | String | Required | Guardian first name |
| guardianLastName | String | Required | Guardian last name |
| guardianEmail | String | Required | Guardian email |
| guardianPhone | String | Required | Guardian phone |
| guardianRelation | String | Required | Relationship to student |
| guardianOccupation | String | Optional | Guardian job |
| guardianAddress | String | Required | Home address |
| documents | Json | Optional | Uploaded document URLs |
| notes | String | Optional | Admin notes |
| reviewedBy | String | Optional | Admin who reviewed |
| reviewedAt | DateTime | Optional | Review timestamp |
| createdAt | DateTime | Default: now() | Submission date |
| updatedAt | DateTime | Auto-update | Last modification |

### Communication

#### Contact
Contact form submissions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| name | String | Required, 1-100 chars | Sender name |
| email | String | Required | Sender email |
| phone | String | Optional | Sender phone |
| subject | String | Required, 1-200 chars | Message subject |
| message | String | Required, max 2000 chars | Message body |
| status | Enum | Default: NEW | NEW, READ, REPLIED, ARCHIVED |
| repliedAt | DateTime | Optional | Reply timestamp |
| createdAt | DateTime | Default: now() | Submission date |

#### Notification
In-app notifications for portal users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| userId | String | FK, Required | Recipient user |
| title | String | Required, 1-100 chars | Notification title |
| message | String | Required, max 500 chars | Notification body |
| type | Enum | Required | INFO, WARNING, SUCCESS, FEE, GRADE, ATTENDANCE |
| link | String | Optional | Action URL |
| read | Boolean | Default: false | Read status |
| createdAt | DateTime | Default: now() | Creation date |

**Relations**:
- Belongs to User

### Site Configuration

#### SiteSetting
Key-value store for site configuration.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, CUID | Unique identifier |
| key | String | Unique, Required | Setting key |
| value | Json | Required | Setting value |
| description | String | Optional | Setting description |
| updatedAt | DateTime | Auto-update | Last modification |

**Common Keys**:
- `school_name`: "Al-Noor Academy"
- `school_tagline`: Tagline text
- `school_stats`: { students, teachers, years, passRate }
- `contact_info`: { address, phone, email, mapUrl }
- `social_links`: { facebook, twitter, instagram, youtube }
- `principal_message`: { name, title, message, image }

## Enums

```prisma
enum Role {
  STUDENT
  PARENT
  TEACHER
  ADMIN
}

enum FeeStatus {
  PENDING
  PAID
  OVERDUE
  PARTIAL
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  APPROVED
  REJECTED
  WAITLISTED
}

enum ContactStatus {
  NEW
  READ
  REPLIED
  ARCHIVED
}

enum NotificationType {
  INFO
  WARNING
  SUCCESS
  FEE
  GRADE
  ATTENDANCE
}
```

## Indexes

```prisma
// Performance indexes
@@index([studentId, date]) // Attendance lookups
@@index([studentId, term, year]) // Grade lookups
@@index([studentId, status]) // Fee lookups
@@index([published, publishedAt]) // News queries
@@index([startDate]) // Event queries
@@index([status, createdAt]) // Application queries
@@index([userId, read]) // Notification queries
```

## Seed Data Plan

### Admin User
```json
{
  "email": "admin@alnooracademy.edu.pk",
  "password": "hashed_password",
  "role": "ADMIN"
}
```

### Sample Data Quantities
| Entity | Count | Purpose |
|--------|-------|---------|
| Teachers | 5 | Staff directory, class assignments |
| Students | 20 | Dashboard demos, attendance, grades |
| Parents | 10 | Parent portal demo |
| Classes | 10 | Academic structure |
| News | 10 | News page content |
| Events | 5 | Calendar content |
| Testimonials | 4 | Homepage display |
| Announcements | 3 | Ticker content |
| Staff | 15 | Staff directory |
