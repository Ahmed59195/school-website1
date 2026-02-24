# Research: Al-Noor Academy School Website

**Feature**: 001-school-website
**Date**: 2026-02-23
**Status**: Complete

## Technology Stack Decisions

### 1. Frontend Framework

**Decision**: Next.js 14 with App Router

**Rationale**:
- App Router provides React Server Components for better performance
- Built-in routing with file-based conventions
- Server-side rendering for SEO-critical public pages
- Client components only where interactivity is needed
- Native support for streaming and Suspense

**Alternatives Considered**:
- Pages Router: Rejected - older paradigm, less performant
- Remix: Rejected - smaller ecosystem, constitution mandates Next.js
- Astro: Rejected - not suitable for portal functionality

### 2. UI Component Library

**Decision**: shadcn/ui with Tailwind CSS

**Rationale**:
- Copy-paste components allow full customization
- Built on Radix UI primitives for accessibility
- Tailwind integration ensures consistent styling
- No vendor lock-in - components are owned
- Active community and regular updates

**Alternatives Considered**:
- Material UI: Rejected - heavier bundle, opinionated styling
- Chakra UI: Rejected - runtime CSS-in-JS performance concerns
- Headless UI: Rejected - less feature-complete than Radix

### 3. Authentication Strategy

**Decision**: NextAuth.js with JWT strategy and Credentials provider

**Rationale**:
- JWT tokens work well with serverless (Vercel)
- No session database required for auth
- Role stored in JWT payload for middleware checks
- Credentials provider for email/password login
- Easy to extend for future OAuth providers

**Implementation Pattern**:
```
1. User submits email/password
2. API validates credentials against Prisma
3. NextAuth creates JWT with user id, email, role
4. JWT stored in HTTP-only cookie
5. Middleware extracts JWT, checks role for protected routes
6. Role-based redirect to appropriate dashboard
```

**Alternatives Considered**:
- Session strategy: Rejected - requires database hits on every request
- Clerk: Rejected - external dependency, cost concerns
- Auth0: Rejected - overkill for single-tenant school app

### 4. Internationalization (i18n)

**Decision**: next-i18next with namespace-based translations

**Rationale**:
- Industry standard for Next.js i18n
- Supports RTL for Urdu out of the box
- Namespace separation (common, home, portal) reduces bundle size
- Server-side translation loading for SSR pages
- Cookie-based language persistence

**Implementation Pattern**:
```
public/locales/
├── en/
│   ├── common.json      # Shared (nav, footer, buttons)
│   ├── home.json        # Homepage
│   ├── about.json       # About page
│   ├── academics.json   # Academics page
│   ├── admissions.json  # Admissions page
│   ├── portal.json      # All portal dashboards
│   └── forms.json       # Form labels and validation
└── ur/
    └── [same structure]
```

**Alternatives Considered**:
- next-intl: Rejected - less mature than next-i18next
- react-i18next alone: Rejected - missing Next.js optimizations
- Paraglide: Rejected - newer, less ecosystem support

### 5. Form Handling & Validation

**Decision**: react-hook-form + Zod (client + server)

**Rationale**:
- react-hook-form: Uncontrolled forms for performance
- Zod: Single schema for client and server validation
- Type inference from Zod schemas
- Built-in error handling and display
- Supports multi-step forms with state persistence

**Implementation Pattern**:
```typescript
// Shared schema (src/lib/validations/application.ts)
const applicationSchema = z.object({...})

// Client: react-hook-form with zodResolver
const form = useForm({ resolver: zodResolver(applicationSchema) })

// Server: Zod parse in API route
const validated = applicationSchema.parse(body)
```

**Alternatives Considered**:
- Formik: Rejected - controlled inputs, performance concerns
- Yup: Rejected - Zod has better TypeScript integration
- Manual validation: Rejected - error-prone, duplicated logic

### 6. Database ORM

**Decision**: Prisma ORM v7 with PostgreSQL

**Rationale**:
- Type-safe database client generated from schema
- Declarative schema with automatic migrations
- Relation handling simplifies parent-child queries
- Built-in connection pooling for serverless
- Constitution mandate

**Connection Strategy**:
- Use connection pooling for serverless (Vercel)
- DATABASE_URL with `?pgbouncer=true` for Neon/Supabase
- Singleton pattern for Prisma client

**Alternatives Considered**:
- Drizzle ORM: Rejected - less mature, constitution mandates Prisma
- Kysely: Rejected - query builder, not full ORM
- Raw SQL: Prohibited by constitution

### 7. File Upload Service

**Decision**: Cloudinary via API

**Rationale**:
- CDN delivery for optimized images
- On-the-fly transformations (resize, crop, format)
- Generous free tier for school use
- Direct upload from client with signed URLs
- Constitution mandate

**Implementation Pattern**:
```
1. Client requests signed upload URL from our API
2. Client uploads directly to Cloudinary
3. Cloudinary returns public URL
4. Client submits form with Cloudinary URL
5. Server stores URL in database
```

**Upload Limits**:
- Images: 10MB max
- Documents (PDF): 10MB max
- Allowed types: jpg, png, webp, pdf

**Alternatives Considered**:
- AWS S3: Rejected - more complex setup, constitution mandates Cloudinary
- Uploadthing: Rejected - newer service, less proven
- Vercel Blob: Rejected - limited transformations

### 8. Email Service

**Decision**: Nodemailer with SendGrid SMTP

**Rationale**:
- SendGrid free tier: 100 emails/day
- Reliable delivery with tracking
- Nodemailer is Node.js standard
- Easy template integration
- Constitution mandate

**Email Types**:
| Type | Trigger | Template |
|------|---------|----------|
| Application Confirmation | Form submit | application-received |
| Application Status Update | Admin action | application-status |
| Contact Form Receipt | Form submit | contact-received |
| Fee Reminder | Scheduled job | fee-reminder |
| Password Reset | User request | password-reset |

**Alternatives Considered**:
- Resend: Rejected - newer, less proven at scale
- AWS SES: Rejected - more complex setup
- Postmark: Rejected - higher cost

### 9. Payment Processing

**Decision**: Stripe Checkout for fee payments

**Rationale**:
- Industry standard, PCI compliant
- Hosted checkout reduces scope
- Supports one-time and subscription payments
- Webhook integration for payment confirmation
- Constitution mandate

**Implementation Pattern**:
```
1. Parent clicks "Pay Fee" on pending fee
2. API creates Stripe Checkout session
3. User redirected to Stripe hosted page
4. User completes payment
5. Stripe webhook updates Fee status to PAID
6. Email confirmation sent
```

**Alternatives Considered**:
- Stripe Elements: Rejected - more complex, PCI scope increases
- PayPal: Rejected - less developer-friendly
- Razorpay: Rejected - regional limitation

### 10. Hosting & Deployment

**Decision**: Vercel for hosting, Neon for PostgreSQL

**Rationale**:
- Vercel: Native Next.js support, edge functions, analytics
- Neon: Serverless PostgreSQL, automatic scaling, free tier
- Both have generous free tiers for school use
- Zero-config deployment from Git

**Environment Strategy**:
```
Production:  main branch → vercel.app
Preview:     PR branches → preview URLs
Development: local → localhost:3000
```

**Alternatives Considered**:
- Railway: Rejected - less Next.js optimization
- Supabase: Viable alternative for database
- PlanetScale: Rejected - MySQL only

### 11. State Management

**Decision**: React Server Components + URL state + React Context (minimal)

**Rationale**:
- Server Components eliminate need for client state in many cases
- URL search params for filters, pagination, search
- React Context only for theme and language (cross-cutting)
- No global state library needed

**State Locations**:
| State Type | Location |
|------------|----------|
| Server data | React Server Components |
| Filters/Search | URL search params |
| Theme | next-themes (localStorage + context) |
| Language | next-i18next (cookie + context) |
| Form state | react-hook-form (local) |
| Auth | NextAuth session |

**Alternatives Considered**:
- Redux: Rejected - overkill, adds complexity
- Zustand: Rejected - not needed with RSC
- Jotai: Rejected - not needed with RSC

### 12. Image Optimization

**Decision**: Next.js Image component + Cloudinary

**Rationale**:
- Next.js Image: Automatic WebP conversion, lazy loading, sizing
- Cloudinary: CDN delivery, transformations for uploaded images
- Constitution mandate for Next.js Image

**Implementation**:
- Static images: public/ directory + next/image
- Dynamic images (uploads): Cloudinary URLs + next/image with loader

## Architecture Decisions

### Server vs Client Components Strategy

**Default**: Server Components

**Use Client Components When**:
- User interactions (onClick, onChange)
- Browser APIs needed (localStorage, geolocation)
- Hooks required (useState, useEffect, useContext)
- Third-party client libraries (react-hook-form, next-themes)

**Pattern by Page Type**:
| Page Type | Strategy |
|-----------|----------|
| Public pages (Home, About, etc.) | Server Components, client islands for interactions |
| Forms (Contact, Application) | Client Component wrapper, server actions for submit |
| Portal dashboards | Server Component for data, client for interactions |
| Data tables (attendance, grades) | Server Component with client pagination |

### API Route Structure

**Convention**: RESTful with Next.js Route Handlers

```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts    # NextAuth handler
├── applications/
│   ├── route.ts                   # GET (list), POST (create)
│   └── [id]/route.ts              # GET, PATCH, DELETE
├── students/
│   ├── route.ts                   # GET (list)
│   └── [id]/
│       ├── route.ts               # GET (details)
│       ├── attendance/route.ts    # GET attendance
│       └── grades/route.ts        # GET grades
├── teachers/
│   └── [id]/
│       └── classes/route.ts       # GET teacher's classes
├── classes/
│   └── [id]/
│       ├── attendance/route.ts    # POST attendance
│       └── grades/route.ts        # POST grades
├── fees/
│   ├── route.ts                   # GET (list)
│   └── [id]/
│       └── checkout/route.ts      # POST (create Stripe session)
├── news/route.ts                  # GET (list)
├── events/route.ts                # GET (list)
├── staff/route.ts                 # GET (list)
├── contact/route.ts               # POST (send email)
├── upload/route.ts                # POST (get signed URL)
└── webhooks/
    └── stripe/route.ts            # POST (Stripe webhook)
```

### Middleware Strategy

**File**: `src/middleware.ts`

**Responsibilities**:
1. Protect all `/portal/*` routes
2. Extract JWT and validate
3. Redirect unauthenticated to `/login`
4. Pass user info to route handlers via headers

**Middleware Matcher**:
```typescript
export const config = {
  matcher: ['/portal/:path*', '/api/students/:path*', '/api/teachers/:path*', '/api/fees/:path*']
}
```

### Error Handling Strategy

**Levels**:
1. **Zod validation errors**: Return 400 with field-level errors
2. **Auth errors**: Return 401/403, redirect to login
3. **Prisma errors**: Log server-side, return generic 500
4. **Not found**: Return 404, show custom page
5. **Unexpected errors**: Log, return 500, show error page

**Client Error Boundaries**:
- Global error boundary in root layout
- Per-page error.tsx for granular recovery

## Performance Strategy

### Static vs Dynamic Rendering

| Page | Rendering | Revalidation |
|------|-----------|--------------|
| Homepage | Static | 1 hour (ISR) |
| About | Static | 24 hours |
| Academics | Static | 24 hours |
| Admissions | Static | 1 hour |
| Student Life | Static | 1 hour |
| News list | Static | 10 minutes |
| News article | Static | On-demand |
| Events | Dynamic | N/A |
| Staff Directory | Static | 1 hour |
| Contact | Static | N/A |
| Portal pages | Dynamic | N/A |

### Loading Strategy

1. **Suspense boundaries** around data-fetching components
2. **Loading skeletons** that match content layout
3. **Streaming** for portal dashboard widgets
4. **Prefetch** for likely navigation targets

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Optimize hero image, preload fonts |
| FID | < 100ms | Minimize JS, defer non-critical |
| CLS | < 0.1 | Reserve space for images, no layout shifts |

## Security Considerations

### Authentication Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT expires in 7 days (configurable)
- HTTP-only cookies prevent XSS access to tokens
- CSRF protection via SameSite cookie attribute

### Input Validation

- All inputs validated server-side with Zod
- Prisma parameterized queries prevent SQL injection
- HTML sanitization for user-generated content (DOMPurify)

### File Upload Security

- Allowed file types: jpg, png, webp, pdf
- Max file size: 10MB
- Cloudinary virus scanning
- No executable file types

### API Security

- Rate limiting on auth endpoints
- CORS configured for production domain
- No sensitive data in error responses
- Request size limits

## Resolved Clarifications

All technical context items have been resolved. No outstanding NEEDS CLARIFICATION items.

| Item | Resolution |
|------|------------|
| Language/Version | TypeScript 5.x, Node.js 20 LTS |
| Primary Dependencies | Next.js 14, Prisma 7, NextAuth 5 |
| Storage | PostgreSQL via Neon |
| Testing | Vitest + React Testing Library + Playwright |
| Target Platform | Vercel (serverless) |
| Project Type | Full-stack web application |
| Performance Goals | Lighthouse 90+, LCP < 2.5s |
| Constraints | < 3s page load, mobile-first, WCAG 2.1 AA |
| Scale/Scope | Single school, ~1000 users, 20+ pages |
