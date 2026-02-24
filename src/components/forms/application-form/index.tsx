"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ApplicationData } from "@/lib/validations/application"
import { Step1StudentInfo } from "./step-1-student"
import { Step2GuardianInfo } from "./step-2-guardian"
import { Step3Documents } from "./step-3-documents"
import { Step4Review } from "./step-4-review"

const steps = [
  { id: 1, name: "Student Info", description: "Student details" },
  { id: 2, name: "Guardian Info", description: "Parent/Guardian details" },
  { id: 3, name: "Documents", description: "Upload documents" },
  { id: 4, name: "Review", description: "Review and submit" },
]

export function ApplicationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<ApplicationData>>({
    termsAccepted: false,
  })

  const updateFormData = (data: Partial<ApplicationData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      toast.success("Application submitted successfully!")
      router.push(`/admissions/apply/success?id=${data.applicationNumber}`)
    } catch (error) {
      console.error("Application submission error:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn(
                "relative",
                stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
              )}
            >
              {step.id < currentStep ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-primary" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </div>
                </>
              ) : step.id === currentStep ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-muted" />
                  </div>
                  <div
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-primary">
                      {step.id}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-muted" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background">
                    <span className="text-sm font-medium text-muted-foreground">
                      {step.id}
                    </span>
                  </div>
                </>
              )}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:block">
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Form Content */}
      <Card className="mt-12">
        <CardContent className="p-6 md:p-8">
          {currentStep === 1 && (
            <Step1StudentInfo
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2GuardianInfo
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 3 && (
            <Step3Documents
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {currentStep === 4 && (
            <Step4Review
              data={formData}
              onUpdate={updateFormData}
              onSubmit={handleSubmit}
              onPrev={prevStep}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
