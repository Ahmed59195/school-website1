"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight, Download, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get("id")

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold">Application Submitted!</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Thank you for applying to Al-Noor Academy. Your application has been
          received and is being processed.
        </p>

        {/* Application Number */}
        {applicationId && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Your Application Number
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                {applicationId}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please save this number for future reference
              </p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mt-8 text-left">
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">What Happens Next?</h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  1
                </span>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">
                    You will receive a confirmation email shortly with your
                    application details.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  2
                </span>
                <div>
                  <p className="font-medium">Document Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Our admissions team will review your application and
                    documents within 3-5 business days.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  3
                </span>
                <div>
                  <p className="font-medium">Assessment Scheduling</p>
                  <p className="text-sm text-muted-foreground">
                    If your application is complete, we will contact you to
                    schedule an assessment test.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  4
                </span>
                <div>
                  <p className="font-medium">Interview & Decision</p>
                  <p className="text-sm text-muted-foreground">
                    After the assessment, there will be a family interview. The
                    final decision will be communicated within a week.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-6">
            <p className="font-medium mb-3">Questions about your application?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:admissions@alnooracademy.edu.pk"
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                admissions@alnooracademy.edu.pk
              </a>
              <a
                href="tel:+92-21-1234567"
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +92-21-1234567
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/admissions">
              Back to Admissions
            </Link>
          </Button>
          <Button className="group" asChild>
            <Link href="/">
              Return to Homepage
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-16 text-center">
          <p>Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
