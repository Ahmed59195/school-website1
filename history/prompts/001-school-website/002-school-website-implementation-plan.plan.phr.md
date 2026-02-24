---
id: 002
title: "School Website Implementation Plan"
stage: plan
date: 2026-02-23
surface: agent
model: claude-opus-4-5-20251101
feature: 001-school-website
branch: 001-school-website
user: ahmedali
command: /sp.plan
labels: ["planning", "architecture", "next.js", "prisma", "full-stack"]
links:
  spec: specs/001-school-website/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-school-website/plan.md
  - specs/001-school-website/research.md
  - specs/001-school-website/data-model.md
  - specs/001-school-website/quickstart.md
  - specs/001-school-website/contracts/api-routes.md
tests: []
---

# Prompt History Record: School Website Implementation Plan

## Prompt Text (Verbatim)

```
/sp.plan

Create a detailed technical implementation plan for the school website using the following stack:

FRONTEND:
- Next.js 14 with App Router and TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- next-themes for dark/light mode
- next-i18next for English/Urdu language switching
- react-hook-form + Zod for form validation
- lucide-react for icons
- date-fns for date formatting
- axios for API calls

BACKEND:
- Next.js 14 API Routes (no separate backend)
- Prisma ORM v7 with PostgreSQL
- NextAuth.js for authentication (JWT strategy)
- bcryptjs for password hashing
- Zod for server-side validation

PAYMENTS:
- Stripe for online fee payments

EMAIL:
- Nodemailer + SendGrid for transactional emails

FILE STORAGE:
- Cloudinary for image and document uploads

PLAN MUST COVER:

1. Project Architecture
   - Folder structure overview
   - Naming conventions
   - Server vs Client component strategy
   - API route structure

2. Database Design
   - All models and relationships (already in schema.prisma)
   - Seed data plan (admin user, sample students, sample news)

3. Authentication Flow
   - Login page
   - JWT token with role stored
   - Middleware protecting portal routes
   - Role-based redirects after login

4. API Endpoints Plan
   - List all required API routes
   - Method, path, and purpose for each
   - Authentication requirements

5. Page Implementation Order
   - Phase 1: Layout, Navbar, Footer, Homepage
   - Phase 2: About, Academics, Admissions, Student Life, News, Staff, Contact
   - Phase 3: Auth pages (Login, Register)
   - Phase 4: Student Portal, Parent Portal
   - Phase 5: Teacher Portal, Admin Dashboard
   - Phase 6: Payments, Email notifications, i18n, Dark mode, SEO

6. Reusable Components List
   - Layout components (Navbar, Footer, Sidebar)
   - UI components (HeroSection, StatsCard, NewsCard, EventCard, TestimonialCard)
   - Form components (ContactForm, ApplicationForm, LoginForm)
   - Portal components (DashboardCard, AttendanceTable, GradesTable)

7. Third Party Integrations
   - Stripe setup and fee payment flow
   - Cloudinary upload flow
   - SendGrid email flow
   - Google Maps embed

8. SEO Strategy
   - Metadata for each page
   - sitemap.xml
   - robots.txt
   - Open Graph tags

9. Performance Strategy
   - Static pages vs dynamic pages
   - Image optimization plan
   - Loading states and skeletons

10. Deployment Plan
    - Vercel for hosting
    - Environment variables needed
    - Database hosting (Neon or Supabase)
```

## Response Summary

Created comprehensive implementation plan with the following artifacts:

### Generated Artifacts

1. **plan.md** - Main implementation plan
   - Technical context with all stack decisions
   - Constitution compliance check (all 10 principles passed)
   - Complete source code structure (80+ files planned)
   - 12 implementation phases with detailed tasks
   - 40+ reusable components cataloged
   - Third-party integration flows (Stripe, Cloudinary, SendGrid)
   - SEO and performance strategies
   - Deployment plan for Vercel + Neon

2. **research.md** - Technology decisions
   - 12 major technology decisions documented
   - Rationale for each choice
   - Alternatives considered and rejected
   - Implementation patterns defined
   - Security considerations

3. **data-model.md** - Database design
   - 20+ entity definitions
   - Complete field specifications with types and constraints
   - Relationship diagrams (ASCII)
   - Enum definitions
   - Index recommendations
   - Seed data plan

4. **contracts/api-routes.md** - API documentation
   - 50+ API endpoints documented
   - Request/response schemas (TypeScript)
   - Authentication requirements per endpoint
   - Query parameters and pagination
   - Error response formats

5. **quickstart.md** - Development setup guide
   - Prerequisites and installation
   - Environment variable setup
   - Database setup commands
   - Test account credentials
   - Common development scripts
   - Troubleshooting guide

### Implementation Phases

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| 1 | Foundation | shadcn/ui, i18n, themes, Prisma setup |
| 2 | Public Pages | 8 public pages (Home, About, etc.) |
| 3 | Authentication | NextAuth, JWT, middleware, login |
| 4 | Application Form | Multi-step form, Cloudinary uploads |
| 5 | Student Portal | Dashboard, attendance, grades, fees |
| 6 | Parent Portal | Children overview, notifications |
| 7 | Teacher Portal | Classes, attendance marking, grades |
| 8 | Admin Portal | Stats, users, applications, fees |
| 9 | Payments | Stripe checkout, webhooks |
| 10 | Email | SendGrid templates and service |
| 11 | i18n | English/Urdu translations, RTL |
| 12 | Polish | Performance, SEO, accessibility |

### Constitution Compliance

All 10 constitution principles verified:
- ✅ Tech Stack (Next.js 14, Prisma 7, etc.)
- ✅ Code Quality (TypeScript strict, no `any`)
- ✅ Database (Prisma only, try/catch)
- ✅ Auth & Security (NextAuth JWT, 4 roles)
- ✅ Components (shadcn/ui, mobile-first)
- ✅ Performance (Lighthouse 90+)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Multilingual (next-i18next, RTL)
- ✅ File Structure (route groups)
- ✅ Git Workflow (emoji commits)

## Outcome

- Implementation plan created at `specs/001-school-website/plan.md`
- All Phase 0 and Phase 1 artifacts generated
- Agent context (CLAUDE.md) updated with project stack
- Ready for task generation via `/sp.tasks`
- No ADR suggestions triggered (no contentious architectural decisions)
