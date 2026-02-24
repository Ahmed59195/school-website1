import { Metadata } from "next"
import Link from "next/link"
import {
  FileText,
  Calendar,
  CreditCard,
  CheckCircle,
  HelpCircle,
  ArrowRight,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Admissions - Al-Noor Academy",
  description:
    "Learn about Al-Noor Academy's admission process, fee structure, and how to apply for your child's enrollment.",
}

const admissionSteps = [
  {
    step: 1,
    title: "Submit Application",
    description:
      "Complete the online application form with student and guardian details.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Document Submission",
    description:
      "Upload required documents including birth certificate and previous school records.",
    icon: CheckCircle,
  },
  {
    step: 3,
    title: "Assessment Test",
    description:
      "Student attends an age-appropriate assessment to determine readiness.",
    icon: Calendar,
  },
  {
    step: 4,
    title: "Interview",
    description: "Family interview with school administration to discuss goals.",
    icon: HelpCircle,
  },
  {
    step: 5,
    title: "Fee Payment",
    description:
      "Upon acceptance, complete fee payment to secure enrollment.",
    icon: CreditCard,
  },
]

const feeStructure = [
  {
    level: "Pre-Kindergarten",
    admission: "30,000",
    monthly: "8,000",
    annual: "96,000",
  },
  {
    level: "Kindergarten",
    admission: "30,000",
    monthly: "9,000",
    annual: "108,000",
  },
  {
    level: "Grades 1-5",
    admission: "35,000",
    monthly: "10,000",
    annual: "120,000",
  },
  {
    level: "Grades 6-8",
    admission: "40,000",
    monthly: "12,000",
    annual: "144,000",
  },
  {
    level: "Grades 9-10",
    admission: "45,000",
    monthly: "14,000",
    annual: "168,000",
  },
  {
    level: "Grades 11-12",
    admission: "50,000",
    monthly: "16,000",
    annual: "192,000",
  },
]

const faqs = [
  {
    question: "What are the age requirements for admission?",
    answer:
      "For Pre-Kindergarten, children must be 3 years old by September 1st of the admission year. Kindergarten requires children to be 5 years old by the same date. For other grades, the standard age requirements apply based on the Pakistani education system.",
  },
  {
    question: "What documents are required for admission?",
    answer:
      "Required documents include: Birth Certificate (original and copy), Previous school leaving certificate and report cards, 4 passport-size photographs, Parent/Guardian CNIC copies, Medical fitness certificate, and Vaccination record.",
  },
  {
    question: "Is there a sibling discount available?",
    answer:
      "Yes, we offer a 10% discount on tuition fees for the second sibling and 15% for the third sibling enrolled simultaneously.",
  },
  {
    question: "What is the medium of instruction?",
    answer:
      "The primary medium of instruction is English, with Urdu taught as a compulsory subject. Islamic Studies may be taught in Urdu or English based on grade level.",
  },
  {
    question: "Do you offer scholarships?",
    answer:
      "Yes, Al-Noor Academy offers merit-based scholarships for academically outstanding students and need-based financial assistance for deserving families. Applications for scholarships are reviewed annually.",
  },
  {
    question: "What is the school timing?",
    answer:
      "School hours are from 8:00 AM to 2:30 PM for primary classes and 8:00 AM to 3:00 PM for higher classes. Pre-school sessions end at 12:30 PM.",
  },
  {
    question: "Is transportation available?",
    answer:
      "Yes, school bus service is available for most areas of the city. Transportation fees are charged separately based on the pickup/drop-off location.",
  },
  {
    question: "When does the admission cycle start?",
    answer:
      "Admissions for the new academic year typically open in January. However, we accept applications throughout the year subject to seat availability.",
  },
]

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        title="Admissions"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }]}
      />

      <div className="container-custom py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Al-Noor Academy Admissions
            </h2>
            <p className="text-muted-foreground text-lg">
              We are delighted that you are considering Al-Noor Academy for your
              child&apos;s education. Our admissions process is designed to be
              straightforward and supportive. Below you will find all the
              information you need to begin your application.
            </p>
          </div>
          <div className="mt-8">
            <Button size="lg" className="group" asChild>
              <Link href="/admissions/apply">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Admission Process */}
        <section className="mb-16">
          <SectionHeader
            title="Admission Process"
            subtitle="Follow these simple steps to enroll your child"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {admissionSteps.map((step) => (
              <Card key={step.step} className="relative">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mt-4 mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fee Structure */}
        <section className="mb-16">
          <SectionHeader
            title="Fee Structure"
            subtitle="Transparent pricing for all grade levels (All amounts in PKR)"
          />
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade Level</TableHead>
                    <TableHead className="text-right">Admission Fee</TableHead>
                    <TableHead className="text-right">Monthly Fee</TableHead>
                    <TableHead className="text-right">Annual Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructure.map((fee) => (
                    <TableRow key={fee.level}>
                      <TableCell className="font-medium">{fee.level}</TableCell>
                      <TableCell className="text-right">
                        Rs. {fee.admission}
                      </TableCell>
                      <TableCell className="text-right">
                        Rs. {fee.monthly}
                      </TableCell>
                      <TableCell className="text-right">
                        Rs. {fee.annual}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="mt-4 text-sm text-muted-foreground">
            * Fees are subject to annual revision. Additional charges may apply
            for books, uniforms, transportation, and extracurricular activities.
          </p>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find answers to common admission queries"
          />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact CTA */}
        <section>
          <Card className="bg-muted/50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Have More Questions?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Our admissions team is here to help. Contact us for any queries
                about the admission process or to schedule a campus visit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Admissions</Link>
                </Button>
                <Button className="group" asChild>
                  <Link href="/admissions/apply">
                    Start Application
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}
