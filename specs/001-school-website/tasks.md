# Tasks: Al-Noor Academy School Website

**Input**: Design documents from `/specs/001-school-website/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-routes.md

**Tests**: Not explicitly requested - focusing on implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Next.js App Router)
- **Components**: `src/components/`
- **API Routes**: `src/app/api/`
- **Pages**: `src/app/(public)/`, `src/app/(auth)/`, `src/app/(portal)/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and configuration

- [ ] T001 Initialize shadcn/ui with `npx shadcn@latest init` and configure components.json
- [ ] T002 [P] Install core shadcn/ui components: button, card, input, form, table, dialog, accordion, tabs, toast, skeleton, dropdown-menu, avatar, badge, separator
- [ ] T003 [P] Install and configure next-themes in src/components/providers/theme-provider.tsx
- [ ] T004 [P] Install and configure next-i18next with English/Urdu support in next-i18next.config.js
- [ ] T005 [P] Configure Tailwind CSS theme colors and fonts in tailwind.config.ts
- [ ] T006 [P] Create utility functions in src/lib/utils.ts (cn, formatDate, formatCurrency)
- [ ] T007 [P] Create TypeScript types barrel export in src/types/index.ts
- [ ] T008 [P] Create constants file in src/utils/constants.ts (routes, roles, status enums)
- [ ] T009 Update Prisma schema with all entities from data-model.md in prisma/schema.prisma
- [ ] T010 Run Prisma migrations with `npx prisma migrate dev --name init`
- [ ] T011 Create database seed script in prisma/seed.ts with admin user, sample students, teachers, news, events
- [ ] T012 Configure Prisma client singleton in src/lib/prisma.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create root layout with providers (theme, i18n, toast, session) in src/app/layout.tsx
- [ ] T014 [P] Create ThemeToggle component in src/components/layout/theme-toggle.tsx
- [ ] T015 [P] Create LanguageSwitcher component in src/components/layout/language-switcher.tsx
- [ ] T016 Create Navbar component with logo, nav links, theme toggle, language switcher, login button in src/components/layout/navbar.tsx
- [ ] T017 Create mobile hamburger menu for Navbar (responsive drawer) in src/components/layout/mobile-menu.tsx
- [ ] T018 [P] Create Footer component with school info, quick links, social icons, copyright in src/components/layout/footer.tsx
- [ ] T019 Create public layout with Navbar and Footer in src/app/(public)/layout.tsx
- [ ] T020 [P] Create PageHeader component (title + breadcrumb) in src/components/shared/page-header.tsx
- [ ] T021 [P] Create SectionHeader component (heading + subtitle) in src/components/shared/section-header.tsx
- [ ] T022 [P] Create LoadingSkeleton component in src/components/shared/loading-skeleton.tsx
- [ ] T023 [P] Create EmptyState component in src/components/shared/empty-state.tsx
- [ ] T024 [P] Create Pagination component in src/components/shared/pagination.tsx
- [ ] T025 [P] Create base English translation files in public/locales/en/common.json
- [ ] T026 [P] Create base Urdu translation files in public/locales/ur/common.json
- [ ] T027 Create custom 404 page in src/app/not-found.tsx
- [ ] T028 Create custom error page in src/app/error.tsx
- [ ] T029 Create global loading component in src/app/loading.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Prospective Parent Explores School (Priority: P1) 🎯 MVP

**Goal**: Prospective parents can visit the website, explore school information, and be compelled to apply

**Independent Test**: Navigate all public pages as anonymous user, click through homepage, about, academics, admissions info

### Homepage Components

- [ ] T030 [US1] Create HeroSection component with school name, tagline, Apply Now + Learn More CTAs in src/components/home/hero-section.tsx
- [ ] T031 [P] [US1] Create StatsSection component with animated counters (students, teachers, years, pass rate) in src/components/home/stats-section.tsx
- [ ] T032 [P] [US1] Create AnnouncementsTicker component with horizontal scrolling news in src/components/home/announcements-ticker.tsx
- [ ] T033 [P] [US1] Create AboutPreview component with mission and link to About page in src/components/home/about-preview.tsx
- [ ] T034 [P] [US1] Create NewsCard component for featured news items in src/components/news/news-card.tsx
- [ ] T035 [P] [US1] Create NewsSection component displaying latest 3 news cards in src/components/home/news-section.tsx
- [ ] T036 [P] [US1] Create TestimonialCard component for quotes in src/components/home/testimonial-card.tsx
- [ ] T037 [P] [US1] Create TestimonialsSection component with carousel/grid in src/components/home/testimonials-section.tsx
- [ ] T038 [P] [US1] Create CTASection component with Apply Now banner in src/components/home/cta-section.tsx

### Homepage API & Page

- [ ] T039 [US1] Create GET /api/announcements route in src/app/api/announcements/route.ts
- [ ] T040 [P] [US1] Create GET /api/testimonials route in src/app/api/testimonials/route.ts
- [ ] T041 [P] [US1] Create GET /api/settings route for school stats in src/app/api/settings/route.ts
- [ ] T042 [US1] Assemble Homepage with all sections in src/app/(public)/page.tsx
- [ ] T043 [US1] Create homepage translation file in public/locales/en/home.json

### About Page

- [ ] T044 [US1] Create About Us page with history, mission/vision/values, principal message, accreditations in src/app/(public)/about/page.tsx
- [ ] T045 [P] [US1] Create about page translation file in public/locales/en/about.json

### Academics Page

- [ ] T046 [US1] Create Academics page with curriculum, grade levels, departments, calendar download, results in src/app/(public)/academics/page.tsx
- [ ] T047 [P] [US1] Create academics page translation file in public/locales/en/academics.json
- [ ] T048 [P] [US1] Add academic calendar PDF to public/documents/academic-calendar.pdf

### Admissions Page (Info Only)

- [ ] T049 [US1] Create Admissions page with process steps, fee structure table, FAQ accordion in src/app/(public)/admissions/page.tsx
- [ ] T050 [P] [US1] Create admissions page translation file in public/locales/en/admissions.json

**Checkpoint**: User Story 1 complete - prospective parents can explore all informational pages

---

## Phase 4: User Story 2 - Parent Submits Admission Application (Priority: P1) 🎯 MVP

**Goal**: Parents can complete multi-step admission application and receive confirmation

**Independent Test**: Fill out all 4 steps of application form with test data, submit, verify confirmation

### Form Infrastructure

- [ ] T051 [US2] Create Zod validation schema for application in src/lib/validations/application.ts
- [ ] T052 [P] [US2] Create Cloudinary upload helper in src/lib/cloudinary.ts
- [ ] T053 [P] [US2] Create SendGrid email helper in src/lib/email.ts
- [ ] T054 [P] [US2] Create upload API route for signed URLs in src/app/api/upload/route.ts

### Multi-Step Form Components

- [ ] T055 [US2] Create ApplicationForm wrapper with step state and progress indicator in src/components/forms/application-form/index.tsx
- [ ] T056 [P] [US2] Create Step1StudentInfo form (name, DOB, grade) in src/components/forms/application-form/step-1-student.tsx
- [ ] T057 [P] [US2] Create Step2GuardianInfo form (guardian details) in src/components/forms/application-form/step-2-guardian.tsx
- [ ] T058 [P] [US2] Create Step3Documents form with file upload in src/components/forms/application-form/step-3-documents.tsx
- [ ] T059 [US2] Create Step4Review form with summary and submit in src/components/forms/application-form/step-4-review.tsx

### Application API & Page

- [ ] T060 [US2] Create POST /api/applications route with validation and email in src/app/api/applications/route.ts
- [ ] T061 [US2] Create application form page at src/app/(public)/admissions/apply/page.tsx
- [ ] T062 [P] [US2] Create application success page at src/app/(public)/admissions/apply/success/page.tsx
- [ ] T063 [P] [US2] Create forms translation file in public/locales/en/forms.json

**Checkpoint**: User Story 2 complete - parents can submit admission applications

---

## Phase 5: User Story 3 - Student Views Dashboard (Priority: P2)

**Goal**: Enrolled students can log in and view their attendance, grades, events, and fees

**Independent Test**: Log in as student, verify dashboard shows personalized data

### Authentication Setup (Shared for US3-US6)

- [ ] T064 Create NextAuth configuration with credentials provider in src/lib/auth.ts
- [ ] T065 Create NextAuth route handler in src/app/api/auth/[...nextauth]/route.ts
- [ ] T066 [P] Create Zod validation schema for login in src/lib/validations/auth.ts
- [ ] T067 Create auth middleware protecting /portal/* routes in src/middleware.ts
- [ ] T068 [P] Create LoginForm component with email/password in src/components/forms/login-form.tsx
- [ ] T069 Create auth layout (centered card) in src/app/(auth)/layout.tsx
- [ ] T070 Create login page in src/app/(auth)/login/page.tsx
- [ ] T071 [P] Create auth translation file in public/locales/en/auth.json

### Portal Layout (Shared for US3-US6)

- [ ] T072 Create Sidebar component for portal navigation in src/components/layout/sidebar.tsx
- [ ] T073 Create portal layout with sidebar and header in src/app/(portal)/layout.tsx

### Student Dashboard Components

- [ ] T074 [P] [US3] Create DashboardCard component (stat card with icon) in src/components/portal/dashboard-card.tsx
- [ ] T075 [P] [US3] Create AttendanceSummary component (present/absent/late counts) in src/components/portal/attendance-summary.tsx
- [ ] T076 [P] [US3] Create GradesTable component (subject, score, grade) in src/components/portal/grades-table.tsx
- [ ] T077 [P] [US3] Create EventsWidget component (upcoming events list) in src/components/portal/events-widget.tsx
- [ ] T078 [P] [US3] Create FeesWidget component (pending/paid status) in src/components/portal/fees-widget.tsx

### Student API Routes

- [ ] T079 [US3] Create GET /api/students/me route in src/app/api/students/me/route.ts
- [ ] T080 [P] [US3] Create GET /api/students/me/attendance route in src/app/api/students/me/attendance/route.ts
- [ ] T081 [P] [US3] Create GET /api/students/me/grades route in src/app/api/students/me/grades/route.ts
- [ ] T082 [P] [US3] Create GET /api/students/me/fees route in src/app/api/students/me/fees/route.ts

### Student Dashboard Page

- [ ] T083 [US3] Create student dashboard page in src/app/(portal)/student/page.tsx
- [ ] T084 [P] [US3] Create portal translation file in public/locales/en/portal.json

**Checkpoint**: User Story 3 complete - students can view their dashboard

---

## Phase 6: User Story 4 - Parent Monitors Children's Progress (Priority: P2)

**Goal**: Parents can log in and view all linked children's attendance, grades, and fees

**Independent Test**: Log in as parent with 2 children, verify both children appear, click through each child's details

### Parent Dashboard Components

- [ ] T085 [P] [US4] Create ChildCard component (child overview card) in src/components/portal/child-card.tsx
- [ ] T086 [P] [US4] Create NotificationsList component in src/components/portal/notifications-list.tsx

### Parent API Routes

- [ ] T087 [US4] Create GET /api/parents/me/children route in src/app/api/parents/me/children/route.ts
- [ ] T088 [P] [US4] Create GET /api/parents/me/children/[id] route in src/app/api/parents/me/children/[id]/route.ts
- [ ] T089 [P] [US4] Create GET /api/parents/me/children/[id]/attendance route in src/app/api/parents/me/children/[id]/attendance/route.ts
- [ ] T090 [P] [US4] Create GET /api/parents/me/children/[id]/grades route in src/app/api/parents/me/children/[id]/grades/route.ts
- [ ] T091 [P] [US4] Create GET /api/parents/me/children/[id]/fees route in src/app/api/parents/me/children/[id]/fees/route.ts
- [ ] T092 [P] [US4] Create GET /api/parents/me/notifications route in src/app/api/parents/me/notifications/route.ts
- [ ] T093 [P] [US4] Create PATCH /api/parents/me/notifications/[id] route in src/app/api/parents/me/notifications/[id]/route.ts

### Parent Dashboard Pages

- [ ] T094 [US4] Create parent dashboard page in src/app/(portal)/parent/page.tsx
- [ ] T095 [US4] Create child detail page in src/app/(portal)/parent/child/[id]/page.tsx

**Checkpoint**: User Story 4 complete - parents can monitor all children's progress

---

## Phase 7: User Story 5 - Teacher Manages Class (Priority: P2)

**Goal**: Teachers can log in, view classes, mark attendance, and enter grades

**Independent Test**: Log in as teacher, select class, mark attendance for all students, enter grades for an assessment

### Teacher Dashboard Components

- [ ] T096 [P] [US5] Create ClassList component (assigned classes) in src/components/portal/class-list.tsx
- [ ] T097 [P] [US5] Create ClassRoster component (students in class) in src/components/portal/class-roster.tsx
- [ ] T098 [P] [US5] Create AttendanceForm component (mark attendance) in src/components/forms/attendance-form.tsx
- [ ] T099 [P] [US5] Create GradeEntryForm component (enter grades) in src/components/forms/grade-entry-form.tsx

### Teacher API Routes

- [ ] T100 [US5] Create GET /api/teachers/me/classes route in src/app/api/teachers/me/classes/route.ts
- [ ] T101 [P] [US5] Create GET /api/teachers/me/classes/[id]/students route in src/app/api/teachers/me/classes/[id]/students/route.ts
- [ ] T102 [P] [US5] Create GET /api/teachers/me/classes/[id]/attendance route in src/app/api/teachers/me/classes/[id]/attendance/route.ts
- [ ] T103 [US5] Create POST /api/teachers/me/classes/[id]/attendance route in src/app/api/teachers/me/classes/[id]/attendance/route.ts
- [ ] T104 [US5] Create POST /api/teachers/me/classes/[id]/grades route in src/app/api/teachers/me/classes/[id]/grades/route.ts

### Teacher Dashboard Pages

- [ ] T105 [US5] Create teacher dashboard page in src/app/(portal)/teacher/page.tsx
- [ ] T106 [US5] Create class detail page in src/app/(portal)/teacher/class/[id]/page.tsx
- [ ] T107 [US5] Create attendance page in src/app/(portal)/teacher/class/[id]/attendance/page.tsx
- [ ] T108 [US5] Create grades page in src/app/(portal)/teacher/class/[id]/grades/page.tsx

**Checkpoint**: User Story 5 complete - teachers can manage their classes

---

## Phase 8: User Story 6 - Admin Manages School Operations (Priority: P2)

**Goal**: Admins can view stats, manage users, review applications, and monitor fees

**Independent Test**: Log in as admin, view dashboard stats, review application, update application status

### Admin Dashboard Components

- [ ] T109 [P] [US6] Create UserStats component (user counts by role) in src/components/portal/user-stats.tsx
- [ ] T110 [P] [US6] Create ApplicationsTable component in src/components/portal/applications-table.tsx
- [ ] T111 [P] [US6] Create FeeSummary component in src/components/portal/fee-summary.tsx
- [ ] T112 [P] [US6] Create UsersTable component in src/components/portal/users-table.tsx

### Admin API Routes

- [ ] T113 [US6] Create GET /api/admin/stats route in src/app/api/admin/stats/route.ts
- [ ] T114 [P] [US6] Create GET /api/admin/applications route in src/app/api/admin/applications/route.ts
- [ ] T115 [P] [US6] Create GET /api/admin/applications/[id] route in src/app/api/admin/applications/[id]/route.ts
- [ ] T116 [US6] Create PATCH /api/admin/applications/[id] route (status update) in src/app/api/admin/applications/[id]/route.ts
- [ ] T117 [P] [US6] Create GET /api/admin/users route in src/app/api/admin/users/route.ts
- [ ] T118 [P] [US6] Create GET /api/admin/fees route in src/app/api/admin/fees/route.ts
- [ ] T119 [P] [US6] Create GET /api/admin/contacts route in src/app/api/admin/contacts/route.ts

### Admin Dashboard Pages

- [ ] T120 [US6] Create admin dashboard page in src/app/(portal)/admin/page.tsx
- [ ] T121 [US6] Create applications list page in src/app/(portal)/admin/applications/page.tsx
- [ ] T122 [US6] Create application detail page in src/app/(portal)/admin/applications/[id]/page.tsx
- [ ] T123 [US6] Create users management page in src/app/(portal)/admin/users/page.tsx
- [ ] T124 [US6] Create fees management page in src/app/(portal)/admin/fees/page.tsx

**Checkpoint**: User Story 6 complete - admins can manage school operations

---

## Phase 9: User Story 7 - Visitor Explores Student Life (Priority: P3)

**Goal**: Visitors can explore clubs, sports, gallery, and student council

**Independent Test**: Navigate to Student Life page, view all sections, browse gallery

- [ ] T125 [P] [US7] Create ClubCard component in src/components/student-life/club-card.tsx
- [ ] T126 [P] [US7] Create SportsTeamCard component in src/components/student-life/sports-card.tsx
- [ ] T127 [P] [US7] Create PhotoGallery component (grid with lightbox) in src/components/student-life/photo-gallery.tsx
- [ ] T128 [US7] Create Student Life page in src/app/(public)/student-life/page.tsx
- [ ] T129 [P] [US7] Create student-life translation file in public/locales/en/student-life.json

**Checkpoint**: User Story 7 complete - visitors can explore student life

---

## Phase 10: User Story 8 - Visitor Reads News and Events (Priority: P3)

**Goal**: Visitors can browse news, filter by category, view events calendar

**Independent Test**: View news list, search/filter, read article, view events calendar

### News Components

- [ ] T130 [P] [US8] Create NewsGrid component in src/components/news/news-grid.tsx
- [ ] T131 [P] [US8] Create NewsFilters component (search, category) in src/components/news/news-filters.tsx

### Events Components

- [ ] T132 [P] [US8] Create EventCard component in src/components/events/event-card.tsx
- [ ] T133 [P] [US8] Create EventsCalendar component in src/components/events/events-calendar.tsx

### News & Events API Routes

- [ ] T134 [US8] Create GET /api/news route with pagination/filtering in src/app/api/news/route.ts
- [ ] T135 [P] [US8] Create GET /api/news/[slug] route in src/app/api/news/[slug]/route.ts
- [ ] T136 [P] [US8] Create GET /api/events route in src/app/api/events/route.ts
- [ ] T137 [P] [US8] Create GET /api/newsletters route in src/app/api/newsletters/route.ts

### News & Events Pages

- [ ] T138 [US8] Create news list page in src/app/(public)/news/page.tsx
- [ ] T139 [US8] Create news article page in src/app/(public)/news/[slug]/page.tsx
- [ ] T140 [US8] Create events page in src/app/(public)/events/page.tsx
- [ ] T141 [P] [US8] Create news translation file in public/locales/en/news.json

**Checkpoint**: User Story 8 complete - visitors can read news and view events

---

## Phase 11: User Story 9 - Visitor Contacts School (Priority: P3)

**Goal**: Visitors can submit contact form and receive confirmation

**Independent Test**: Submit contact form with valid data, verify success message

- [ ] T142 [US9] Create Zod validation schema for contact in src/lib/validations/contact.ts
- [ ] T143 [P] [US9] Create ContactForm component in src/components/forms/contact-form.tsx
- [ ] T144 [US9] Create POST /api/contact route with email in src/app/api/contact/route.ts
- [ ] T145 [US9] Create Contact page with form, map, info in src/app/(public)/contact/page.tsx
- [ ] T146 [P] [US9] Create contact translation file in public/locales/en/contact.json

**Checkpoint**: User Story 9 complete - visitors can contact the school

---

## Phase 12: User Story 10 - Visitor Finds Staff Member (Priority: P3)

**Goal**: Visitors can search staff directory and view profiles

**Independent Test**: View staff directory, search for teacher, click to view profile

- [ ] T147 [P] [US10] Create StaffCard component in src/components/staff/staff-card.tsx
- [ ] T148 [P] [US10] Create StaffGrid component with search in src/components/staff/staff-grid.tsx
- [ ] T149 [US10] Create GET /api/staff route in src/app/api/staff/route.ts
- [ ] T150 [P] [US10] Create GET /api/staff/[id] route in src/app/api/staff/[id]/route.ts
- [ ] T151 [US10] Create staff directory page in src/app/(public)/staff/page.tsx
- [ ] T152 [US10] Create staff profile page in src/app/(public)/staff/[id]/page.tsx

**Checkpoint**: User Story 10 complete - visitors can find staff members

---

## Phase 13: User Story 11 - User Switches Language (Priority: P3)

**Goal**: Users can switch between English and Urdu with RTL support

**Independent Test**: Switch to Urdu, verify all text changes and layout is RTL, switch back

- [ ] T153 [US11] Add RTL support styles in src/app/globals.css
- [ ] T154 [US11] Update LanguageSwitcher with cookie persistence in src/components/layout/language-switcher.tsx
- [ ] T155 [P] [US11] Create Urdu translations for home.json in public/locales/ur/home.json
- [ ] T156 [P] [US11] Create Urdu translations for about.json in public/locales/ur/about.json
- [ ] T157 [P] [US11] Create Urdu translations for academics.json in public/locales/ur/academics.json
- [ ] T158 [P] [US11] Create Urdu translations for admissions.json in public/locales/ur/admissions.json
- [ ] T159 [P] [US11] Create Urdu translations for student-life.json in public/locales/ur/student-life.json
- [ ] T160 [P] [US11] Create Urdu translations for news.json in public/locales/ur/news.json
- [ ] T161 [P] [US11] Create Urdu translations for contact.json in public/locales/ur/contact.json
- [ ] T162 [P] [US11] Create Urdu translations for auth.json in public/locales/ur/auth.json
- [ ] T163 [P] [US11] Create Urdu translations for portal.json in public/locales/ur/portal.json
- [ ] T164 [P] [US11] Create Urdu translations for forms.json in public/locales/ur/forms.json

**Checkpoint**: User Story 11 complete - full bilingual support with RTL

---

## Phase 14: User Story 12 - User Toggles Theme (Priority: P4)

**Goal**: Users can toggle dark/light mode with persistent preference

**Independent Test**: Toggle to dark mode, verify colors change, refresh page to verify persistence

- [ ] T165 [US12] Enhance ThemeToggle with localStorage persistence in src/components/layout/theme-toggle.tsx
- [ ] T166 [US12] Update Tailwind dark mode colors in tailwind.config.ts
- [ ] T167 [US12] Verify all components support dark mode styling
- [ ] T168 [US12] Add dark mode variants to all custom components

**Checkpoint**: User Story 12 complete - theme toggle works across all pages

---

## Phase 15: Payments Integration (Cross-Cutting)

**Goal**: Enable fee payments via Stripe for parents

- [ ] T169 Create Stripe helper with checkout session in src/lib/stripe.ts
- [ ] T170 Create POST /api/fees/[id]/checkout route in src/app/api/fees/[id]/checkout/route.ts
- [ ] T171 Create POST /api/webhooks/stripe route in src/app/api/webhooks/stripe/route.ts
- [ ] T172 Create payment success page in src/app/(portal)/payment/success/page.tsx
- [ ] T173 Create payment cancelled page in src/app/(portal)/payment/cancelled/page.tsx
- [ ] T174 Add "Pay Now" button to FeesWidget in src/components/portal/fees-widget.tsx

**Checkpoint**: Payment integration complete

---

## Phase 16: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### SEO

- [ ] T175 [P] Add metadata to homepage in src/app/(public)/page.tsx
- [ ] T176 [P] Add metadata to about page in src/app/(public)/about/page.tsx
- [ ] T177 [P] Add metadata to academics page in src/app/(public)/academics/page.tsx
- [ ] T178 [P] Add metadata to admissions page in src/app/(public)/admissions/page.tsx
- [ ] T179 [P] Add metadata to student life page in src/app/(public)/student-life/page.tsx
- [ ] T180 [P] Add metadata to news pages in src/app/(public)/news/page.tsx
- [ ] T181 [P] Add metadata to events page in src/app/(public)/events/page.tsx
- [ ] T182 [P] Add metadata to staff page in src/app/(public)/staff/page.tsx
- [ ] T183 [P] Add metadata to contact page in src/app/(public)/contact/page.tsx
- [ ] T184 Create sitemap.ts in src/app/sitemap.ts
- [ ] T185 Create robots.ts in src/app/robots.ts
- [ ] T186 [P] Add Open Graph images to public/images/og-image.jpg

### Loading States

- [ ] T187 [P] Add loading skeletons to homepage in src/app/(public)/loading.tsx
- [ ] T188 [P] Add loading skeletons to news page in src/app/(public)/news/loading.tsx
- [ ] T189 [P] Add loading skeletons to events page in src/app/(public)/events/loading.tsx
- [ ] T190 [P] Add loading skeletons to staff page in src/app/(public)/staff/loading.tsx
- [ ] T191 [P] Add loading skeletons to portal pages in src/app/(portal)/loading.tsx

### Toast Notifications

- [ ] T192 Add toast notifications to all form submissions (contact, application, attendance, grades)

### Final Testing & Validation

- [ ] T193 Test dark mode on all pages
- [ ] T194 Test Urdu language on all pages (verify RTL)
- [ ] T195 Test mobile responsiveness on all pages (320px, 768px, 1024px)
- [ ] T196 Run Lighthouse audit on all public pages
- [ ] T197 Fix any Lighthouse issues (performance, accessibility, SEO)
- [ ] T198 Run quickstart.md validation (verify all setup steps work)
- [ ] T199 Final code review and cleanup
- [ ] T200 Update README.md with project documentation

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → User Stories (Phase 3-14)
                                         → Payments (Phase 15)
                                         → Polish (Phase 16)
```

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-14)**: All depend on Foundational phase completion
  - US1 and US2 can run in parallel (both P1)
  - US3-US6 require auth from US3 setup, then can run in parallel
  - US7-US12 can run in parallel after US1 complete
- **Payments (Phase 15)**: Depends on US3/US4 (needs portal)
- **Polish (Phase 16)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Depends On | Can Parallel With |
|-------|----------|------------|-------------------|
| US1 | P1 | Foundational | US2 |
| US2 | P1 | Foundational | US1 |
| US3 | P2 | Foundational + Auth | US4, US5, US6 (after auth setup) |
| US4 | P2 | Auth from US3 | US5, US6 |
| US5 | P2 | Auth from US3 | US4, US6 |
| US6 | P2 | Auth from US3 | US4, US5 |
| US7 | P3 | US1 (layout) | US8, US9, US10, US11, US12 |
| US8 | P3 | US1 (layout) | US7, US9, US10, US11, US12 |
| US9 | P3 | US1 (layout) | US7, US8, US10, US11, US12 |
| US10 | P3 | US1 (layout) | US7, US8, US9, US11, US12 |
| US11 | P3 | All pages | US12 |
| US12 | P4 | Foundational | - |

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004, T005, T006, T007, T008 can all run in parallel

**Phase 2 (Foundational)**:
- T014, T015, T018, T020, T021, T022, T023, T024, T025, T026 can run in parallel

**Phase 3 (US1)**:
- T031-T038 (homepage components) can all run in parallel
- T039, T040, T041 (API routes) can run in parallel

**Portal Stories (US3-US6)**:
- All widget components within each story can run in parallel
- All API GET routes within each story can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Explore School)
4. Complete Phase 4: User Story 2 (Submit Application)
5. **STOP and VALIDATE**: Test public website and application form
6. Deploy MVP to production

### Incremental Delivery

| Milestone | Stories | Deliverable |
|-----------|---------|-------------|
| MVP | US1 + US2 | Public website + Applications |
| Portal v1 | + US3-US6 | All dashboards working |
| Content | + US7-US10 | Full public content |
| i18n | + US11 | Bilingual support |
| Polish | + US12 + Phase 15-16 | Full feature set |

### Parallel Team Strategy

With 3 developers after Foundational phase:
- **Dev A**: US1 → US7 → US11
- **Dev B**: US2 → US8, US9, US10
- **Dev C**: US3-US6 (auth + all portals)

---

## Summary

| Category | Count |
|----------|-------|
| **Total Tasks** | 200 |
| **Setup Tasks** | 12 |
| **Foundational Tasks** | 17 |
| **User Story Tasks** | 153 |
| **Payment Tasks** | 6 |
| **Polish Tasks** | 26 |

| User Story | Tasks | Priority |
|------------|-------|----------|
| US1 (Explore School) | 21 | P1 |
| US2 (Submit Application) | 13 | P1 |
| US3 (Student Dashboard) | 21 | P2 |
| US4 (Parent Dashboard) | 11 | P2 |
| US5 (Teacher Portal) | 13 | P2 |
| US6 (Admin Portal) | 16 | P2 |
| US7 (Student Life) | 5 | P3 |
| US8 (News & Events) | 12 | P3 |
| US9 (Contact) | 5 | P3 |
| US10 (Staff Directory) | 6 | P3 |
| US11 (Language) | 12 | P3 |
| US12 (Theme) | 4 | P4 |

**Suggested MVP Scope**: Phase 1-4 (Setup + Foundational + US1 + US2) = 63 tasks
