---
id: 001
title: "School Website Constitution Creation"
stage: constitution
date: 2026-02-23
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: ahmedali
command: /sp.constitution
labels: ["constitution", "governance", "project-setup", "tech-stack"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests: []
---

# Prompt History Record: School Website Constitution Creation

## Prompt Text (Verbatim)

```
/sp.constitution

Define the governing principles for a professional school website with the following rules:

1. Tech Stack:
   - Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
   - Backend: Next.js API Routes
   - Database: PostgreSQL with Prisma ORM (v7)
   - Auth: NextAuth.js with JWT strategy
   - Payments: Stripe
   - Email: Nodemailer + SendGrid
   - File Upload: Cloudinary

2. Code Quality:
   - Write clean, modular, well-commented TypeScript code
   - Separate concerns: UI components, API routes, database logic
   - Always use TypeScript types — never use "any"
   - Follow Next.js 14 App Router conventions (server vs client components)
   - Use "use client" only when necessary

3. Database:
   - Always use Prisma client for all database operations
   - Never write raw SQL unless absolutely necessary
   - Handle all database errors with try/catch blocks

4. Authentication & Security:
   - All portal routes must be protected with NextAuth middleware
   - Role-based access: STUDENT, PARENT, TEACHER, ADMIN
   - Never expose sensitive data in API responses
   - Validate all form inputs with Zod on both client and server

5. Components:
   - Build reusable components in src/components/
   - Use shadcn/ui components as the base UI library
   - Always prefer existing libraries over custom implementations
   - Every component must be mobile responsive

6. Performance:
   - Use Next.js Image component for all images
   - Implement lazy loading where appropriate
   - All pages must score 90+ on Google Lighthouse

7. Accessibility:
   - Follow WCAG 2.1 AA standards
   - All images must have alt text
   - All forms must have proper labels

8. Multilingual:
   - Support English and Urdu languages
   - Use next-i18next for all text content
   - Translation files are in public/locales/en/ and public/locales/ur/

9. File Structure:
   - Public pages: src/app/(public)/
   - Auth pages: src/app/(auth)/
   - Portal pages: src/app/(portal)/
   - API routes: src/app/api/
   - Components: src/components/
   - Utilities: src/utils/, src/lib/, src/hooks/

10. Git:
    - Commit after every completed feature
    - Use clear commit messages with emojis (e.g. "✨ Add homepage hero section")
```

## Response Summary

Created the School Website Constitution v1.0.0 with all 10 principles defined:

1. **I. Tech Stack** - Defined complete stack (Next.js 14, TypeScript, Tailwind, shadcn/ui, Prisma v7, NextAuth, Stripe, SendGrid, Cloudinary)
2. **II. Code Quality** - TypeScript strict mode, no `any` types, App Router conventions
3. **III. Database** - Prisma-only operations, try/catch mandatory, no raw SQL
4. **IV. Authentication & Security** - RBAC with 4 roles, Zod validation client+server
5. **V. Components** - shadcn/ui base, mobile-first responsive design
6. **VI. Performance** - Lighthouse 90+ target, Next.js Image mandatory
7. **VII. Accessibility** - WCAG 2.1 AA compliance required
8. **VIII. Multilingual Support** - English/Urdu with next-i18next, RTL support
9. **IX. File Structure** - Route groups (public), (auth), (portal) defined
10. **X. Git Workflow** - Emoji commit conventions established

Additional sections added:
- Technology Constraints table (required dependencies)
- Prohibited Patterns list
- Development Workflow with pre-commit checklist
- Governance rules with amendment process

## Outcome

- Constitution created at `.specify/memory/constitution.md`
- Version: 1.0.0 (MAJOR bump - initial establishment)
- Ratified: 2026-02-23
- All templates validated as compatible (no updates required)
- Sync Impact Report embedded as HTML comment in constitution file
