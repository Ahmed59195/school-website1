import { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Award,
  Download,
  ChevronRight,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Academics - Al-Noor Academy",
  description:
    "Explore Al-Noor Academy's curriculum, grade levels, academic programs, and educational approach.",
}

const gradeLevels = [
  {
    name: "Early Years",
    grades: "Pre-K to KG",
    description:
      "A play-based learning approach that develops foundational skills through exploration and discovery.",
    subjects: ["Language Arts", "Numeracy", "Arts & Crafts", "Physical Play"],
  },
  {
    name: "Primary School",
    grades: "Grades 1-5",
    description:
      "Building strong foundations in core subjects with integrated Islamic studies and character development.",
    subjects: [
      "English",
      "Urdu",
      "Mathematics",
      "Science",
      "Social Studies",
      "Islamic Studies",
    ],
  },
  {
    name: "Middle School",
    grades: "Grades 6-8",
    description:
      "Expanding knowledge and critical thinking with specialized subject teachers and co-curricular activities.",
    subjects: [
      "English",
      "Urdu",
      "Mathematics",
      "General Science",
      "Computer Science",
      "Pakistan Studies",
    ],
  },
  {
    name: "High School",
    grades: "Grades 9-10",
    description:
      "Preparing students for board examinations with focused academic preparation and career guidance.",
    subjects: [
      "Physics",
      "Chemistry",
      "Biology/Computer Science",
      "Mathematics",
      "English",
      "Urdu",
    ],
  },
  {
    name: "Intermediate",
    grades: "Grades 11-12",
    description:
      "Advanced studies with specialization in Pre-Medical, Pre-Engineering, or Commerce streams.",
    subjects: [
      "Pre-Medical Track",
      "Pre-Engineering Track",
      "Commerce Track",
    ],
  },
]

const departments = [
  { name: "Science Department", teachers: 15 },
  { name: "Mathematics Department", teachers: 10 },
  { name: "Languages Department", teachers: 12 },
  { name: "Social Studies Department", teachers: 8 },
  { name: "Islamic Studies Department", teachers: 6 },
  { name: "Computer Science Department", teachers: 5 },
  { name: "Physical Education Department", teachers: 4 },
  { name: "Arts Department", teachers: 4 },
]

const achievements = [
  {
    year: "2024",
    achievement: "98% Board Examination Pass Rate",
  },
  {
    year: "2024",
    achievement: "15 students in Top 10 Board Positions",
  },
  {
    year: "2023",
    achievement: "Best School Award - Education Excellence Foundation",
  },
  {
    year: "2023",
    achievement: "National Science Olympiad - 5 Gold Medals",
  },
]

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        title="Academics"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      <div className="container-custom py-12">
        {/* Curriculum Overview */}
        <section className="mb-16">
          <SectionHeader
            title="Our Curriculum"
            subtitle="A comprehensive educational program designed for holistic development"
            align="left"
          />
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              Al-Noor Academy follows a blended curriculum that combines the best
              of national and international educational standards. Our curriculum
              is designed to develop critical thinking, creativity, and a strong
              foundation in core academic subjects while nurturing Islamic values
              and character development.
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <Button variant="outline" className="group" asChild>
              <Link href="/documents/academic-calendar.pdf" target="_blank">
                <Calendar className="mr-2 h-4 w-4" />
                Academic Calendar
                <Download className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Grade Levels */}
        <section className="mb-16">
          <SectionHeader
            title="Grade Levels"
            subtitle="Programs for every stage of your child's educational journey"
          />
          <Accordion type="single" collapsible className="w-full">
            {gradeLevels.map((level, index) => (
              <AccordionItem key={level.name} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold">{level.name}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        ({level.grades})
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-14">
                    <p className="text-muted-foreground mb-4">
                      {level.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {level.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Departments */}
        <section className="mb-16">
          <SectionHeader
            title="Academic Departments"
            subtitle="Expert faculty leading specialized instruction"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <Card key={dept.name}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {dept.teachers} Teachers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Academic Achievements */}
        <section className="mb-16">
          <SectionHeader
            title="Academic Achievements"
            subtitle="Our students consistently excel in academics"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.year}</p>
                    <p className="font-medium">{item.achievement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Join Al-Noor Academy?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
                Give your child the gift of quality education. Learn about our
                admissions process and apply today.
              </p>
              <Button variant="secondary" className="group" asChild>
                <Link href="/admissions">
                  View Admissions
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}
