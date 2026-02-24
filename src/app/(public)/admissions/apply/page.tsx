import { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { ApplicationForm } from "@/components/forms/application-form"

export const metadata: Metadata = {
  title: "Apply Now - Al-Noor Academy",
  description:
    "Submit your admission application to Al-Noor Academy. Complete our online application form to begin the enrollment process.",
}

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        title="Admission Application"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Apply" },
        ]}
      />

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">
              Apply for Admission 2025-2026
            </h2>
            <p className="text-muted-foreground mt-2">
              Complete the application form below. All fields marked with{" "}
              <span className="text-destructive">*</span> are required.
            </p>
          </div>

          <ApplicationForm />
        </div>
      </div>
    </>
  )
}
