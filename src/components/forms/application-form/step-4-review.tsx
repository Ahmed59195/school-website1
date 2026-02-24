"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ApplicationData, gradeOptions, relationshipOptions } from "@/lib/validations/application"
import { ChevronLeft, Loader2, User, Users, FileText, CheckCircle } from "lucide-react"

interface Step4Props {
  data: Partial<ApplicationData>
  onUpdate: (data: Partial<ApplicationData>) => void
  onSubmit: () => void
  onPrev: () => void
  isSubmitting: boolean
}

export function Step4Review({
  data,
  onUpdate,
  onSubmit,
  onPrev,
  isSubmitting,
}: Step4Props) {
  const getGradeLabel = (value: string | undefined) => {
    if (!value) return "Not specified"
    return gradeOptions.find((g) => g.value === value)?.label || value
  }

  const getRelationshipLabel = (value: string | undefined) => {
    if (!value) return "Not specified"
    return relationshipOptions.find((r) => r.value === value)?.label || value
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.termsAccepted) {
      return
    }
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Application</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please review all information before submitting
        </p>
      </div>

      {/* Student Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">
                {data.firstName} {data.lastName}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Date of Birth:</span>
              <p className="font-medium">{data.dateOfBirth || "Not specified"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Gender:</span>
              <p className="font-medium capitalize">{data.gender || "Not specified"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Grade Applying:</span>
              <p className="font-medium">{getGradeLabel(data.gradeApplying)}</p>
            </div>
            {data.previousSchool && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Previous School:</span>
                <p className="font-medium">{data.previousSchool}</p>
              </div>
            )}
            {data.medicalConditions && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Medical Conditions:</span>
                <p className="font-medium">{data.medicalConditions}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <p className="font-medium">{data.guardianName || "Not specified"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Relationship:</span>
              <p className="font-medium">{getRelationshipLabel(data.relationship)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">CNIC:</span>
              <p className="font-medium">{data.guardianCnic || "Not specified"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <p className="font-medium">{data.guardianPhone || "Not specified"}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Email:</span>
              <p className="font-medium">{data.guardianEmail || "Not specified"}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium">
                {data.address}
                {data.city && `, ${data.city}`}
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <span className="text-muted-foreground">Emergency Contact:</span>
              <p className="font-medium">{data.emergencyContactName || "Not specified"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Emergency Phone:</span>
              <p className="font-medium">{data.emergencyContactPhone || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-4 w-4 ${
                  data.birthCertificate ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>Birth Certificate: {data.birthCertificate || "Not uploaded"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-4 w-4 ${
                  data.previousReportCard ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>
                Previous Report Card: {data.previousReportCard || "Not uploaded"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-4 w-4 ${
                  data.guardianCnicCopy ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>
                Guardian CNIC Copy: {data.guardianCnicCopy || "Not uploaded"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-4 w-4 ${
                  data.photographs?.length ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span>
                Photographs:{" "}
                {data.photographs?.length
                  ? `${data.photographs.length} file(s)`
                  : "Not uploaded"}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Missing documents can be submitted at the school office.
          </p>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <div className="border rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.termsAccepted}
            onChange={(e) => onUpdate({ termsAccepted: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="text-sm">
            <span className="font-medium">I agree to the terms and conditions</span>
            <p className="text-muted-foreground mt-1">
              By submitting this application, I confirm that all information
              provided is accurate and complete. I understand that providing false
              information may result in the rejection of the application or
              dismissal from the school.
            </p>
          </div>
        </label>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit" disabled={isSubmitting || !data.termsAccepted}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  )
}
