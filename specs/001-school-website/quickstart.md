# Quick Start Guide: Al-Noor Academy School Website

**Feature**: 001-school-website
**Date**: 2026-02-23

## Prerequisites

- Node.js 20 LTS or higher
- npm 10+ or pnpm 8+
- PostgreSQL 15+ (or Neon/Supabase account)
- Git

## 1. Clone and Install

```bash
# Navigate to project
cd school-website

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## 2. Environment Setup

Edit `.env` with your credentials:

```env
# Database (Neon example)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# SendGrid
SENDGRID_API_KEY="SG.your-api-key"
EMAIL_FROM="noreply@alnooracademy.edu.pk"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

## 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Test Accounts

After seeding, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alnooracademy.edu.pk | Admin123! |
| Teacher | teacher@alnooracademy.edu.pk | Teacher123! |
| Parent | parent@alnooracademy.edu.pk | Parent123! |
| Student | student@alnooracademy.edu.pk | Student123! |

## 6. Key URLs

### Public Pages
- Homepage: `/`
- About: `/about`
- Academics: `/academics`
- Admissions: `/admissions`
- Student Life: `/student-life`
- News: `/news`
- Events: `/events`
- Staff: `/staff`
- Contact: `/contact`

### Auth
- Login: `/login`
- Register: `/register` (if enabled)

### Portal
- Student Dashboard: `/portal/student`
- Parent Dashboard: `/portal/parent`
- Teacher Dashboard: `/portal/teacher`
- Admin Dashboard: `/portal/admin`

## 7. Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio

# Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
npm run format           # Format with Prettier

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
```

## 8. Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Homepage
│   │   ├── about/
│   │   ├── academics/
│   │   ├── admissions/
│   │   ├── student-life/
│   │   ├── news/
│   │   ├── events/
│   │   ├── staff/
│   │   └── contact/
│   ├── (auth)/             # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (portal)/           # Protected portal
│   │   ├── layout.tsx      # Portal layout with sidebar
│   │   ├── student/
│   │   ├── parent/
│   │   ├── teacher/
│   │   └── admin/
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Navbar, Footer, Sidebar
│   ├── home/               # Homepage sections
│   ├── forms/              # Form components
│   └── portal/             # Portal widgets
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth config
│   ├── cloudinary.ts       # Upload helpers
│   ├── email.ts            # Email helpers
│   └── validations/        # Zod schemas
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── utils/                  # Helper functions
```

## 9. Adding shadcn/ui Components

```bash
# Initialize (if not done)
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add accordion
npx shadcn@latest add tabs
npx shadcn@latest add toast
```

## 10. Common Tasks

### Add a New Page

1. Create directory in appropriate route group
2. Add `page.tsx` with Server Component
3. Add translations to `public/locales/en/` and `ur/`
4. Add to navigation if needed

### Add a New API Route

1. Create `route.ts` in `src/app/api/`
2. Define Zod schema in `src/lib/validations/`
3. Add to contracts documentation
4. Implement with Prisma

### Add Form Validation

```typescript
// 1. Define schema (src/lib/validations/example.ts)
import { z } from 'zod'

export const exampleSchema = z.object({
  name: z.string().min(1, 'Required').max(100),
  email: z.string().email('Invalid email'),
})

export type ExampleInput = z.infer<typeof exampleSchema>

// 2. Use in form (client component)
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm<ExampleInput>({
  resolver: zodResolver(exampleSchema),
})

// 3. Validate in API route
const body = await request.json()
const validated = exampleSchema.parse(body)
```

## 11. Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database (dev only!)
npx prisma migrate reset
```

### Prisma Client Errors
```bash
# Regenerate client
npx prisma generate
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Type Errors
```bash
# Full type check
npm run type-check
```

## 12. Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel dashboard
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="production-postgres-url"
NEXTAUTH_URL="https://alnooracademy.edu.pk"
NEXTAUTH_SECRET="production-secret"
# ... other production values
```

## 13. Next Steps

After setup, proceed with implementation:

1. Run `/sp.tasks` to generate implementation tasks
2. Follow phase order from `tasks.md`
3. Commit after each completed task
4. Test each feature before proceeding
