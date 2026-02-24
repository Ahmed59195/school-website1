"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ApplicationData } from "@/lib/validations/application"
import { ChevronLeft, ChevronRight, Upload, FileText, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Step3Props {
  data: Partial<ApplicationData>
  onUpdate: (data: Partial<ApplicationData>) => void
  onNext: () => void
  onPrev: () => void
}

const documentTypes = [
  {
    id: "birthCertificate",
    label: "Birth Certificate",
    required: true,
    description: "Official birth certificate (NADRA B-Form)",
  },
  {
    id: "previousReportCard",
    label: "Previous Report Card",
    required: false,
    description: "Last year's report card or transcript",
  },
  {
    id: "guardianCnicCopy",
    label: "Guardian CNIC Copy",
    required: true,
    description: "Clear copy of guardian's CNIC (front and back)",
  },
  {
    id: "photographs",
    label: "Passport Photos",
    required: true,
    description: "4 recent passport-size photographs",
  },
]

export function Step3Documents({ data, onUpdate, onNext, onPrev }: Step3Props) {
  const handleFileChange = (
    documentId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // In a real implementation, you would upload the file to a cloud storage
      // and store the URL. For now, we'll just store the filename.
      const fileNames = Array.from(files).map((f) => f.name)
      onUpdate({
        [documentId]:
          documentId === "photographs" || documentId === "additionalDocuments"
            ? fileNames
            : fileNames[0],
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Document Upload</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please upload the required documents. Accepted formats: PDF, JPG, PNG
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium">Document Guidelines</p>
            <ul className="mt-1 list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
              <li>Documents should be clear and legible</li>
              <li>Maximum file size: 5MB per document</li>
              <li>You can submit physical copies at the school office later</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {documentTypes.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor={doc.id} className="font-medium">
                  {doc.label}
                  {doc.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {doc.description}
                </p>
                {(data as Record<string, unknown>)[doc.id] ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                    <FileText className="h-4 w-4" />
                    <span>
                      {Array.isArray((data as Record<string, unknown>)[doc.id])
                        ? ((data as Record<string, unknown>)[doc.id] as string[]).join(", ")
                        : String((data as Record<string, unknown>)[doc.id])}
                    </span>
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor={doc.id}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </label>
                <input
                  type="file"
                  id={doc.id}
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple={doc.id === "photographs"}
                  onChange={(e) => handleFileChange(doc.id, e)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Additional Documents */}
        <div className="border rounded-lg p-4 border-dashed">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="additionalDocuments" className="font-medium">
                Additional Documents (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Any other supporting documents you&apos;d like to include
              </p>
              {data.additionalDocuments && data.additionalDocuments.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <FileText className="h-4 w-4" />
                  <span>{data.additionalDocuments.join(", ")}</span>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="additionalDocuments"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </label>
              <input
                type="file"
                id="additionalDocuments"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => handleFileChange("additionalDocuments", e)}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="text-destructive">*</span> Required documents can be
        submitted later at the school office if not available digitally.
      </p>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit">
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
