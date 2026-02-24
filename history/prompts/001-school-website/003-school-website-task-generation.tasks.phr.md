---
id: 003
title: "School Website Task Generation"
stage: tasks
date: 2026-02-23
surface: agent
model: claude-opus-4-5-20251101
feature: 001-school-website
branch: 001-school-website
user: ahmedali
command: /sp.tasks
labels: ["tasks", "implementation", "breakdown", "user-stories"]
links:
  spec: specs/001-school-website/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-school-website/tasks.md
tests: []
---

# Prompt History Record: School Website Task Generation

## Prompt Text (Verbatim)

```
/sp.tasks

Generate a complete ordered task breakdown for the school website project.
Break everything into small, specific, actionable tasks that can be
implemented one at a time.

PHASE 1 — Foundation & Layout:
- Install and configure next-themes for dark/light mode
- Install and configure next-i18next for English/Urdu
- Create root layout with Navbar and Footer
- Build Navbar component:
  * School logo and name
  * Navigation links (Home, About, Academics, Admissions, Student Life, News, Staff, Contact)
  * Language switcher (EN/UR)
  * Dark/light mode toggle
  * Login button
  * Mobile hamburger menu
- Build Footer component:
  * School info, quick links, social media icons, copyright
- Create global styles and theme colors in tailwind.config.ts
- Create reusable UI components:
  * PageHeader (title + breadcrumb)
  * SectionTitle (heading + subtitle)
  * LoadingSkeleton
  * ErrorMessage
  * EmptyState

PHASE 2 — Homepage:
- Build Hero section with animated text, CTA buttons
- Build Stats section (Students, Teachers, Years, Pass Rate)
- Build Announcements ticker
- Build About preview section
- Build Featured News/Events section (fetch latest 3 from API)
- Build Testimonials section
- Build Call-to-Action banner section
- Assemble full Homepage

PHASE 3 — Public Pages:
- Build About Us page (history, mission, vision, principal message)
- Build Academics page (curriculum, departments, calendar download)
- Build Admissions page with multi-step application form
- Build Student Life page (clubs, sports, gallery)
- Build News & Events page (list, search, filter, calendar)
- Build Staff Directory page (grid, search)
- Build individual Teacher Profile page
- Build Contact page (form, map, social links)
- Build 404 page
- Build error page

PHASE 4 — API Routes:
- POST /api/applications — submit admissions application
- POST /api/contact — send contact form email
- GET /api/news — fetch all published news
- GET /api/news/[slug] — fetch single news post
- GET /api/events — fetch all events
- GET /api/staff — fetch all teachers
- GET /api/staff/[id] — fetch single teacher profile
- GET /api/students/[id]/grades — fetch student grades
- GET /api/students/[id]/attendance — fetch student attendance
- GET /api/students/[id]/fees — fetch student fees
- POST /api/fees/pay — initiate Stripe payment
- POST /api/webhooks/stripe — handle Stripe webhook
- GET /api/admin/stats — fetch dashboard stats
- CRUD /api/admin/users — manage users
- CRUD /api/admin/news — manage news posts
- CRUD /api/admin/events — manage events

PHASE 5 — Authentication:
- Build Login page with email/password form
- Build Register page (admin creates accounts)
- Implement forgot password flow
- Implement NextAuth with credentials provider
- Implement role-based redirect after login:
  * STUDENT → /student/dashboard
  * PARENT → /parent/dashboard
  * TEACHER → /teacher/dashboard
  * ADMIN → /admin/dashboard
- Protect all portal routes with middleware

PHASE 6 — Student Portal:
- Build Student Dashboard layout with sidebar
- Build attendance summary widget
- Build recent grades table
- Build upcoming events widget
- Build fee status widget
- Build student profile page

PHASE 7 — Parent Portal:
- Build Parent Dashboard layout with sidebar
- Build children overview cards
- Build fee payment page with Stripe
- Build payment history table
- Build notifications page

PHASE 8 — Teacher Portal:
- Build Teacher Dashboard layout with sidebar
- Build my classes list
- Build mark attendance page
- Build enter grades page
- Build class roster page

PHASE 9 — Admin Dashboard:
- Build Admin Dashboard layout with sidebar
- Build stats overview cards
- Build user management page (list, create, edit, delete)
- Build applications management page
- Build news management page (CRUD)
- Build events management page (CRUD)
- Build fee management page

PHASE 10 — Final Features:
- Add SEO metadata to all pages
- Generate sitemap.xml
- Generate robots.txt
- Add Open Graph images
- Add loading skeletons to all data pages
- Add toast notifications to all forms
- Test dark mode on all pages
- Test Urdu language on all pages
- Test mobile responsiveness on all pages
- Run Lighthouse audit and fix issues
- Final review and cleanup

Each task should be implemented and committed separately with a clear git
commit message before moving to the next task.
```

## Response Summary

Generated comprehensive task breakdown with **200 tasks** organized into 16 phases:

### Task Distribution

| Phase | Focus | Tasks |
|-------|-------|-------|
| 1 | Setup | 12 |
| 2 | Foundational | 17 |
| 3 | US1: Explore School | 21 |
| 4 | US2: Submit Application | 13 |
| 5 | US3: Student Dashboard | 21 |
| 6 | US4: Parent Dashboard | 11 |
| 7 | US5: Teacher Portal | 13 |
| 8 | US6: Admin Portal | 16 |
| 9 | US7: Student Life | 5 |
| 10 | US8: News & Events | 12 |
| 11 | US9: Contact | 5 |
| 12 | US10: Staff Directory | 6 |
| 13 | US11: Language | 12 |
| 14 | US12: Theme | 4 |
| 15 | Payments | 6 |
| 16 | Polish | 26 |

### Key Features of Task List

1. **User Story Organization**: Tasks grouped by user story from spec.md (US1-US12)
2. **Checklist Format**: All tasks follow `- [ ] T### [P?] [US?] Description with path`
3. **Parallel Markers**: [P] indicates parallelizable tasks
4. **Story Labels**: [US1]-[US12] for traceability
5. **File Paths**: Every task includes exact file path
6. **Checkpoints**: Each phase ends with validation checkpoint
7. **Dependency Graph**: Clear phase and story dependencies
8. **MVP Scope**: Identified 63 tasks for MVP (Setup + US1 + US2)

### Parallel Opportunities

- Setup phase: 7 parallel tasks
- Foundational: 10 parallel tasks
- Homepage components: 8 parallel tasks
- Portal widgets: 4-6 parallel per story
- Translations: 10 parallel tasks

### Implementation Strategy

**MVP First**: Phase 1-4 delivers working public website + applications
**Incremental**: Each user story adds independent value
**Team Parallel**: 3 developers can work US1/US2/US3-6 simultaneously

## Outcome

- Task list created at `specs/001-school-website/tasks.md`
- 200 actionable tasks with exact file paths
- 12 user stories mapped to implementation phases
- Dependency graph for execution order
- Parallel execution examples included
- Ready for `/sp.implement` or manual execution
