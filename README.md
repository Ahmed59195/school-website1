# Al-Noor Academy School Website

A comprehensive K-12 school website built with Next.js 15, featuring public pages, role-based authentication, and portals for students, parents, teachers, and administrators.

## Features

- **Public Website**: Homepage, About, Academics, Admissions, Student Life, News, Events, Staff Directory, Contact
- **Authentication**: NextAuth.js with role-based access (Student, Parent, Teacher, Admin)
- **Student Portal**: Dashboard with attendance, grades, fees, and upcoming events
- **Parent Portal**: View all children's progress, attendance, grades, and fee payments
- **Teacher Portal**: Manage classes, mark attendance, enter grades
- **Admin Portal**: User management, application review, fee tracking, system settings
- **Multi-language**: English and Urdu support with RTL layout
- **Dark Mode**: Full dark/light theme support
- **Payments**: Stripe integration for fee payments
- **Responsive**: Mobile-first design for all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: SendGrid
- **File Uploads**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Environment variables (see below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with the required values:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/school_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# SendGrid
SENDGRID_API_KEY="your-sendgrid-key"
EMAIL_FROM="noreply@alnooracademy.edu.pk"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database (optional):
```bash
npx prisma db seed
```

7. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (no auth required)
│   ├── (auth)/            # Auth pages (login)
│   ├── (portal)/          # Protected portal pages
│   │   ├── student/       # Student dashboard
│   │   ├── parent/        # Parent dashboard
│   │   ├── teacher/       # Teacher dashboard
│   │   └── admin/         # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   ├── portal/            # Portal widgets
│   └── shared/            # Shared components
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript types
└── hooks/                 # Custom React hooks

public/
├── locales/
│   ├── en/                # English translations
│   └── ur/                # Urdu translations
├── images/                # Static images
└── documents/             # Downloadable documents
```

## Default Credentials

After seeding the database, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@alnooracademy.edu.pk | Admin123! |
| Teacher | teacher1@alnooracademy.edu.pk | Teacher123! |
| Parent | parent1@example.com | Parent123! |
| Student | student1@alnooracademy.edu.pk | Student123! |

**Note:** There are multiple teachers (teacher1-5), parents (parent1-3), and students (student1-5) with the same password pattern.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database GUI
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed the database

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Import the project to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Submit a pull request

## License

This project is proprietary software for Al-Noor Academy.
