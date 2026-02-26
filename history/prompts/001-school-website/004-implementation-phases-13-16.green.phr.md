---
id: 004
title: Implementation Phases 13-16 Complete
stage: green
date: 2026-02-25
surface: agent
model: claude-opus-4-5-20251101
feature: 001-school-website
branch: 001-school-website
user: ahmedali
command: /sp.implement
labels: ["implementation", "i18n", "stripe", "seo", "polish"]
links:
  spec: specs/001-school-website/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - public/locales/ur/about.json
  - public/locales/ur/academics.json
  - public/locales/ur/admissions.json
  - public/locales/ur/auth.json
  - public/locales/ur/student-life.json
  - public/locales/ur/news.json
  - public/locales/ur/contact.json
  - public/locales/ur/portal.json
  - public/locales/ur/forms.json
  - src/lib/stripe.ts
  - src/app/api/fees/[id]/checkout/route.ts
  - src/app/api/webhooks/stripe/route.ts
  - src/app/(portal)/payment/success/page.tsx
  - src/app/(portal)/payment/cancelled/page.tsx
  - src/app/sitemap.ts
  - src/app/robots.ts
  - src/app/(public)/loading.tsx
  - src/app/(public)/news/loading.tsx
  - src/app/(public)/events/loading.tsx
  - src/app/(public)/staff/loading.tsx
  - src/app/(portal)/loading.tsx
  - README.md
tests:
  - TypeScript compilation passed (npx tsc --noEmit)
---

## Prompt

/sp.implement

## Response snapshot

Executed implementation for Al-Noor Academy School Website Phases 13-16:

**Phase 13: User Story 11 - Language Switching (T153-T164)**
- Verified RTL support styles already present in globals.css (T153)
- Verified LanguageSwitcher cookie persistence already implemented (T154)
- Created all 9 Urdu translation files (T155-T164):
  - about.json, academics.json, admissions.json, auth.json
  - student-life.json, news.json, contact.json, portal.json, forms.json

**Phase 14: User Story 12 - Theme Toggle (T165-T168)**
- Verified theme infrastructure using next-themes with localStorage persistence
- Dark mode colors configured via CSS variables in globals.css

**Phase 15: Payments Integration (T169-T174)**
- Created Stripe helper with checkout session (src/lib/stripe.ts)
- Created checkout API route (src/app/api/fees/[id]/checkout/route.ts)
- Created Stripe webhook handler (src/app/api/webhooks/stripe/route.ts)
- Created payment success and cancelled pages
- FeesWidget already has "Pay Now" button with onPayFee prop

**Phase 16: Polish & Cross-Cutting (T175-T200)**
- Added metadata to homepage
- Verified metadata exists on 8/9 public pages
- Created sitemap.ts with dynamic news/staff pages
- Created robots.ts with proper crawl rules
- Created loading skeletons for public and portal pages
- Updated README.md with comprehensive documentation

**Status: 189/200 tasks complete (94.5%)**

## Outcome

- ✅ Impact: Major progress - implemented language switching, Stripe payments, SEO, and polish
- 🧪 Tests: TypeScript compilation passes (npx tsc --noEmit)
- 📁 Files: 22 files created/modified
- 🔁 Next prompts: Manual testing (T192-T199) - dark mode, RTL, responsiveness, Lighthouse audit
- 🧠 Reflection: Efficient batch processing of related tasks; discovered many items were already implemented

## Evaluation notes (flywheel)

- Failure modes observed: Initial Stripe API version mismatch, Prisma relation name mismatch (parents vs parentLinks)
- Graders run and results (PASS/FAIL): TypeScript compilation PASS
- Prompt variant (if applicable): /sp.implement standard flow
- Next experiment (smallest change to try): Run npm run build to verify production build
