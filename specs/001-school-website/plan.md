# Implementation Plan: Al-Noor Academy School Website

**Branch**: `001-school-website` | **Date**: 2026-02-23 | **Spec**: [spec.md](./spec.md)
**Input**: Professional K-12 school website with public pages and authenticated portal

## Summary

Build a comprehensive school website for Al-Noor Academy featuring:
1. **Public website** with 8 pages showcasing the school
2. **Authentication system** with 4 roles (Student, Parent, Teacher, Admin)
3. **Role-based portal** with dashboards for each user type
4. **Multilingual support** (English/Urdu) with RTL
5. **Integrations**: Stripe payments, Cloudinary uploads, SendGrid emails

Technology: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Prisma 7, PostgreSQL, NextAuth.js

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS
**Primary Dependencies**: Next.js 14, Prisma 7, NextAuth 5, shadcn/ui, Tailwind CSS
**Storage**: PostgreSQL via Neon (serverless)
**Testing**: Vitest + React Testing Library + Playwright
**Target Platform**: Vercel (serverless edge)
**Project Type**: Full-stack web application
**Performance Goals**: Lighthouse 90+, LCP < 2.5s, FID < 100ms, CLS < 0.1
**Constraints**: Mobile-first responsive, WCAG 2.1 AA, < 3s page load
**Scale/Scope**: Single school, ~1000 users, 20+ pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Tech Stack | ✅ PASS | Next.js 14, TypeScript, Tailwind, shadcn/ui, Prisma 7, NextAuth, Stripe, SendGrid, Cloudinary |
| II. Code Quality | ✅ PASS | TypeScript strict mode, no `any`, App Router conventions |
| III. Database | ✅ PASS | Prisma only, try/catch required, migrations |
| IV. Auth & Security | ✅ PASS | NextAuth JWT, 4 roles, Zod validation both sides |
| V. Components | ✅ PASS | shadcn/ui base, mobile-first, barrel exports |
| VI. Performance | ✅ PASS | Next.js Image, Suspense, Lighthouse 90+ target |
| VII. Accessibility | ✅ PASS | WCAG 2.1 AA, proper labels, keyboard nav |
| VIII. Multilingual | ✅ PASS | next-i18next, RTL support, namespaced translations |
| IX. File Structure | ✅ PASS | Route groups (public), (auth), (portal) |
| X. Git Workflow | ✅ PASS | Emoji commits, atomic commits |

**All gates passed. No violations requiring justification.**

## Project Structure

### Documentation (this feature)

```text
specs/001-school-website/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Setup guide
├── contracts/
│   └── api-routes.md    # API documentation
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (public)/                    # Public pages (no auth)
│   │   ├── layout.tsx               # Public layout with Navbar/Footer
│   │   ├── page.tsx                 # Homepage
│   │   ├── about/page.tsx
│   │   ├── academics/page.tsx
│   │   ├── admissions/
│   │   │   ├── page.tsx
│   │   │   └── apply/page.tsx       # Multi-step form
│   │   ├── student-life/page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx             # News list
│   │   │   └── [slug]/page.tsx      # News article
│   │   ├── events/page.tsx
│   │   ├── staff/
│   │   │   ├── page.tsx             # Staff directory
│   │   │   └── [id]/page.tsx        # Staff profile
│   │   └── contact/page.tsx
│   ├── (auth)/                      # Auth pages
│   │   ├── layout.tsx               # Centered auth layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (portal)/                    # Protected portal
│   │   ├── layout.tsx               # Portal layout with sidebar
│   │   ├── student/
│   │   │   └── page.tsx             # Student dashboard
│   │   ├── parent/
│   │   │   ├── page.tsx             # Parent dashboard
│   │   │   └── child/[id]/page.tsx  # Child details
│   │   ├── teacher/
│   │   │   ├── page.tsx             # Teacher dashboard
│   │   │   └── class/[id]/
│   │   │       ├── page.tsx         # Class overview
│   │   │       ├── attendance/page.tsx
│   │   │       └── grades/page.tsx
│   │   └── admin/
│   │       ├── page.tsx             # Admin dashboard
│   │       ├── users/page.tsx
│   │       ├── applications/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── fees/page.tsx
│   │       └── content/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── applications/
│   │   ├── contact/route.ts
│   │   ├── upload/route.ts
│   │   ├── news/route.ts
│   │   ├── events/route.ts
│   │   ├── staff/route.ts
│   │   ├── announcements/route.ts
│   │   ├── testimonials/route.ts
│   │   ├── settings/route.ts
│   │   ├── students/
│   │   ├── parents/
│   │   ├── teachers/
│   │   ├── admin/
│   │   ├── fees/
│   │   └── webhooks/stripe/route.ts
│   ├── layout.tsx                   # Root layout (providers)
│   ├── not-found.tsx               # 404 page
│   ├── error.tsx                   # Error page
│   └── loading.tsx                 # Global loading
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── accordion.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   └── ... (other shadcn components)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   ├── language-switcher.tsx
│   │   └── theme-toggle.tsx
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── stats-section.tsx
│   │   ├── about-preview.tsx
│   │   ├── news-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── cta-section.tsx
│   │   └── announcements-ticker.tsx
│   ├── forms/
│   │   ├── contact-form.tsx
│   │   ├── login-form.tsx
│   │   ├── application-form/
│   │   │   ├── index.tsx
│   │   │   ├── step-1-student.tsx
│   │   │   ├── step-2-guardian.tsx
│   │   │   ├── step-3-documents.tsx
│   │   │   └── step-4-review.tsx
│   │   └── attendance-form.tsx
│   ├── portal/
│   │   ├── dashboard-card.tsx
│   │   ├── attendance-summary.tsx
│   │   ├── grades-table.tsx
│   │   ├── fees-widget.tsx
│   │   ├── events-widget.tsx
│   │   ├── notifications-list.tsx
│   │   ├── class-list.tsx
│   │   └── user-stats.tsx
│   ├── news/
│   │   ├── news-card.tsx
│   │   ├── news-grid.tsx
│   │   └── news-filters.tsx
│   ├── events/
│   │   ├── event-card.tsx
│   │   └── events-calendar.tsx
│   ├── staff/
│   │   ├── staff-card.tsx
│   │   └── staff-grid.tsx
│   └── shared/
│       ├── page-header.tsx
│       ├── section-header.tsx
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       └── pagination.tsx
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # NextAuth configuration
│   ├── auth-options.ts             # NextAuth options
│   ├── cloudinary.ts               # Upload helpers
│   ├── email.ts                    # SendGrid helpers
│   ├── stripe.ts                   # Stripe helpers
│   ├── utils.ts                    # General utilities
│   └── validations/
│       ├── application.ts
│       ├── contact.ts
│       ├── auth.ts
│       ├── attendance.ts
│       └── grade.ts
├── hooks/
│   ├── use-toast.ts
│   ├── use-media-query.ts
│   └── use-debounce.ts
├── types/
│   ├── index.ts                    # Re-exports
│   ├── auth.ts                     # Auth types
│   ├── api.ts                      # API response types
│   └── prisma.ts                   # Extended Prisma types
├── utils/
│   ├── cn.ts                       # classnames utility
│   ├── format.ts                   # Date/number formatting
│   └── constants.ts                # App constants
└── middleware.ts                   # Auth middleware

public/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── home.json
│   │   ├── about.json
│   │   ├── academics.json
│   │   ├── admissions.json
│   │   ├── student-life.json
│   │   ├── news.json
│   │   ├── contact.json
│   │   ├── auth.json
│   │   ├── portal.json
│   │   └── forms.json
│   └── ur/
│       └── [same structure]
├── images/
│   ├── logo.svg
│   ├── hero-bg.jpg
│   └── placeholders/
└── documents/
    └── academic-calendar.pdf

prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

**Structure Decision**: Full-stack Next.js App Router monolith with route groups for separation of concerns. Public, auth, and portal sections are clearly delineated. All components organized by feature area.

## Implementation Phases

### Phase 1: Foundation & Layout
**Goal**: Establish project infrastructure and shared layouts

1. **Project Setup**
   - Configure shadcn/ui with Tailwind
   - Set up next-i18next with English/Urdu
   - Configure next-themes for dark/light mode
   - Set up Prisma with PostgreSQL

2. **Root Layout**
   - Theme provider
   - i18n provider
   - Toast provider
   - Auth session provider

3. **Public Layout**
   - Responsive Navbar with navigation links
   - Language switcher
   - Theme toggle
   - Mobile menu
   - Footer with school info and links

4. **Database Schema**
   - Update schema.prisma with all entities
   - Run migrations
   - Create seed script

### Phase 2: Public Pages
**Goal**: Complete all public-facing pages

1. **Homepage**
   - Hero section with CTAs
   - Announcements ticker
   - Quick stats
   - About preview
   - Featured news
   - Testimonials
   - CTA banner

2. **About Page**
   - School history
   - Mission/Vision/Values
   - Principal's message
   - Accreditations
   - Stats

3. **Academics Page**
   - Curriculum overview
   - Grade levels
   - Departments
   - Academic calendar download
   - Results highlights

4. **Admissions Page**
   - Process steps
   - Fee structure
   - FAQ accordion
   - Link to application

5. **Student Life Page**
   - Clubs & activities
   - Sports teams
   - Photo gallery
   - Student council

6. **News & Events**
   - News list with search/filter
   - Individual article pages
   - Events calendar
   - Newsletter archive

7. **Staff Directory**
   - Searchable grid
   - Individual profiles

8. **Contact Page**
   - Contact form
   - School info
   - Map embed
   - Social links

### Phase 3: Authentication
**Goal**: Implement secure login and role-based access

1. **NextAuth Setup**
   - Credentials provider
   - JWT strategy with role
   - Session callbacks

2. **Auth Pages**
   - Login page with form
   - Error states

3. **Middleware**
   - Protect /portal/* routes
   - Role-based redirects
   - API route protection

### Phase 4: Application Form
**Goal**: Multi-step admission application

1. **Form Infrastructure**
   - Multi-step form state
   - Progress indicator
   - Form persistence

2. **Step Components**
   - Student info form
   - Guardian info form
   - Document upload (Cloudinary)
   - Review & submit

3. **Submission Handling**
   - API route
   - Email confirmation
   - Success page

### Phase 5: Student Portal
**Goal**: Student dashboard and features

1. **Portal Layout**
   - Sidebar navigation
   - User info header
   - Breadcrumbs

2. **Student Dashboard**
   - Welcome message
   - Attendance summary
   - Recent grades
   - Upcoming events
   - Fee status

3. **API Routes**
   - GET /api/students/me
   - GET /api/students/me/attendance
   - GET /api/students/me/grades
   - GET /api/students/me/fees

### Phase 6: Parent Portal
**Goal**: Parent dashboard with child overview

1. **Parent Dashboard**
   - Children overview
   - Per-child summaries
   - Notifications

2. **Child Details**
   - Attendance view
   - Grades view
   - Fees view

3. **API Routes**
   - GET /api/parents/me/children
   - GET /api/parents/me/children/[id]/*
   - GET /api/parents/me/notifications

### Phase 7: Teacher Portal
**Goal**: Teacher class management

1. **Teacher Dashboard**
   - Assigned classes
   - Quick actions

2. **Class Management**
   - Student roster
   - Attendance marking
   - Grade entry

3. **API Routes**
   - GET /api/teachers/me/classes
   - POST /api/teachers/me/classes/[id]/attendance
   - POST /api/teachers/me/classes/[id]/grades

### Phase 8: Admin Portal
**Goal**: Administrative dashboard

1. **Admin Dashboard**
   - User statistics
   - Recent applications
   - Fee summary
   - Quick links

2. **User Management**
   - User list
   - Role filtering

3. **Application Management**
   - Application list
   - Status updates
   - Detail view

4. **Fee Management**
   - Fee overview
   - Collection stats

5. **API Routes**
   - GET /api/admin/stats
   - GET/PATCH /api/admin/applications
   - GET /api/admin/users
   - GET /api/admin/fees

### Phase 9: Payments
**Goal**: Stripe integration for fee payments

1. **Stripe Setup**
   - API configuration
   - Checkout session creation

2. **Payment Flow**
   - Pay fee button
   - Redirect to Stripe
   - Webhook handling
   - Success/cancel pages

3. **API Routes**
   - POST /api/fees/[id]/checkout
   - POST /api/webhooks/stripe

### Phase 10: Email Notifications
**Goal**: Transactional emails via SendGrid

1. **Email Templates**
   - Application confirmation
   - Application status update
   - Contact form receipt
   - Fee reminder

2. **Email Service**
   - SendGrid integration
   - Template rendering
   - Error handling

### Phase 11: Internationalization
**Goal**: Complete English/Urdu support

1. **Translation Files**
   - All namespaces for English
   - All namespaces for Urdu
   - RTL layout adjustments

2. **Dynamic Content**
   - Admin content in both languages
   - Database content i18n strategy

### Phase 12: Polish & Optimization
**Goal**: Performance, SEO, accessibility

1. **Performance**
   - Image optimization
   - Loading skeletons
   - Lazy loading
   - Bundle optimization

2. **SEO**
   - Meta tags per page
   - Open Graph tags
   - sitemap.xml
   - robots.txt

3. **Accessibility**
   - Keyboard navigation
   - Screen reader testing
   - Color contrast
   - Focus states

4. **Error Handling**
   - Custom 404 page
   - Custom error page
   - Error boundaries

## Component Library

### Layout Components
| Component | Location | Purpose |
|-----------|----------|---------|
| Navbar | components/layout/navbar.tsx | Main navigation |
| Footer | components/layout/footer.tsx | Site footer |
| Sidebar | components/layout/sidebar.tsx | Portal navigation |
| LanguageSwitcher | components/layout/language-switcher.tsx | EN/UR toggle |
| ThemeToggle | components/layout/theme-toggle.tsx | Dark/light mode |

### Home Section Components
| Component | Location | Purpose |
|-----------|----------|---------|
| HeroSection | components/home/hero-section.tsx | Hero with CTAs |
| StatsSection | components/home/stats-section.tsx | Quick stats |
| AboutPreview | components/home/about-preview.tsx | Mission snippet |
| NewsSection | components/home/news-section.tsx | Featured news |
| TestimonialsSection | components/home/testimonials-section.tsx | Quotes carousel |
| CTASection | components/home/cta-section.tsx | Apply now banner |
| AnnouncementsTicker | components/home/announcements-ticker.tsx | News ticker |

### Form Components
| Component | Location | Purpose |
|-----------|----------|---------|
| ContactForm | components/forms/contact-form.tsx | Contact page form |
| LoginForm | components/forms/login-form.tsx | Auth login |
| ApplicationForm | components/forms/application-form/ | Multi-step admission |
| AttendanceForm | components/forms/attendance-form.tsx | Mark attendance |

### Portal Components
| Component | Location | Purpose |
|-----------|----------|---------|
| DashboardCard | components/portal/dashboard-card.tsx | Stats card |
| AttendanceSummary | components/portal/attendance-summary.tsx | Attendance widget |
| GradesTable | components/portal/grades-table.tsx | Grades display |
| FeesWidget | components/portal/fees-widget.tsx | Fee status |
| EventsWidget | components/portal/events-widget.tsx | Upcoming events |
| NotificationsList | components/portal/notifications-list.tsx | Notifications |
| ClassList | components/portal/class-list.tsx | Teacher classes |
| UserStats | components/portal/user-stats.tsx | Admin stats |

### Content Components
| Component | Location | Purpose |
|-----------|----------|---------|
| NewsCard | components/news/news-card.tsx | News article card |
| NewsGrid | components/news/news-grid.tsx | News list layout |
| EventCard | components/events/event-card.tsx | Event card |
| EventsCalendar | components/events/events-calendar.tsx | Calendar view |
| StaffCard | components/staff/staff-card.tsx | Staff member card |
| StaffGrid | components/staff/staff-grid.tsx | Staff directory |

### Shared Components
| Component | Location | Purpose |
|-----------|----------|---------|
| PageHeader | components/shared/page-header.tsx | Page title section |
| SectionHeader | components/shared/section-header.tsx | Section titles |
| EmptyState | components/shared/empty-state.tsx | No data display |
| LoadingSkeleton | components/shared/loading-skeleton.tsx | Loading states |
| Pagination | components/shared/pagination.tsx | Page navigation |

## Third-Party Integrations

### Stripe Payment Flow
```
1. User clicks "Pay Fee" on pending fee
2. Client calls POST /api/fees/[id]/checkout
3. Server creates Stripe Checkout Session
4. Server returns checkout URL
5. Client redirects to Stripe
6. User completes payment on Stripe
7. Stripe sends webhook to POST /api/webhooks/stripe
8. Server updates fee status to PAID
9. Server sends confirmation email
10. User redirected to success page
```

### Cloudinary Upload Flow
```
1. User selects file in form
2. Client calls POST /api/upload for signed URL
3. Server returns signed upload params
4. Client uploads directly to Cloudinary
5. Cloudinary returns public URL
6. Client stores URL in form state
7. URL submitted with form data
```

### SendGrid Email Flow
```
1. Event triggers email (form submit, status change)
2. Server calls email service with template + data
3. Service renders template with data
4. Service sends via SendGrid API
5. SendGrid delivers email
6. Delivery status logged
```

## SEO Strategy

### Static Generation
| Page | Generation | Revalidation |
|------|------------|--------------|
| Homepage | ISR | 1 hour |
| About | Static | Build time |
| Academics | Static | Build time |
| Admissions | Static | 1 hour |
| Student Life | ISR | 1 hour |
| News List | ISR | 10 minutes |
| News Article | ISR | On-demand |
| Events | Dynamic | N/A |
| Staff | ISR | 1 hour |
| Contact | Static | Build time |

### Metadata Pattern
```typescript
// Per-page metadata
export const metadata: Metadata = {
  title: 'Page Title | Al-Noor Academy',
  description: 'Page description',
  openGraph: {
    title: 'Page Title | Al-Noor Academy',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
}
```

### SEO Files
- `/sitemap.ts` - Dynamic sitemap generation
- `/robots.ts` - Robots.txt configuration
- `/opengraph-image.tsx` - Dynamic OG images (optional)

## Performance Strategy

### Image Optimization
- All images via Next.js `Image` component
- Cloudinary for dynamic images with transformations
- WebP format preferred
- Responsive sizes with `srcSet`

### Loading Strategy
- Suspense boundaries around data-fetching
- Skeleton components matching content layout
- Progressive loading for long lists
- Prefetch on hover for navigation

### Bundle Optimization
- Dynamic imports for heavy components
- Route-based code splitting (automatic)
- Tree shaking enabled
- No barrel file re-exports of heavy modules

## Environment Variables

```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SendGrid
SENDGRID_API_KEY=
EMAIL_FROM=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## Deployment Plan

### Platform: Vercel

**Configuration**:
- Framework: Next.js (auto-detected)
- Build Command: `npm run build`
- Output Directory: `.next`
- Node.js Version: 20.x

### Database: Neon

**Configuration**:
- Serverless PostgreSQL
- Connection pooling enabled
- SSL required

### Pre-deployment Checklist
- [ ] All environment variables set
- [ ] Database migrated
- [ ] Seed data loaded (production seeds)
- [ ] Domain configured
- [ ] SSL enabled (automatic)
- [ ] Error monitoring configured

### Post-deployment Verification
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Forms submit successfully
- [ ] Payments process (test mode)
- [ ] Emails send
- [ ] Images load from Cloudinary

## Related Documents

- [Specification](./spec.md) - Feature requirements
- [Research](./research.md) - Technology decisions
- [Data Model](./data-model.md) - Entity definitions
- [API Contracts](./contracts/api-routes.md) - API documentation
- [Quick Start](./quickstart.md) - Development setup
- [Tasks](./tasks.md) - Implementation tasks (via `/sp.tasks`)
