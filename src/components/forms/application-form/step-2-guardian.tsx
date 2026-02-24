"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  guardianInfoSchema,
  GuardianInfo,
  relationshipOptions,
  ApplicationData,
} from "@/lib/validations/application"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Step2Props {
  data: Partial<ApplicationData>
  onUpdate: (data: Partial<ApplicationData>) => void
  onNext: () => void
  onPrev: () => void
}

export function Step2GuardianInfo({ data, onUpdate, onNext, onPrev }: Step2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuardianInfo>({
    resolver: zodResolver(guardianInfoSchema),
    defaultValues: {
      guardianName: data.guardianName || "",
      relationship: data.relationship || "",
      guardianCnic: data.guardianCnic || "",
      guardianPhone: data.guardianPhone || "",
      guardianEmail: data.guardianEmail || "",
      guardianOccupation: data.guardianOccupation || "",
      address: data.address || "",
      city: data.city || "",
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
    },
  })

  const onSubmit = (formData: GuardianInfo) => {
    onUpdate(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Guardian Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide the parent/guardian&apos;s details
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Guardian Name */}
        <div className="space-y-2">
          <Label htmlFor="guardianName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="guardianName"
            {...register("guardianName")}
            placeholder="Enter full name"
          />
          {errors.guardianName && (
            <p className="text-sm text-destructive">
              {errors.guardianName.message}
            </p>
          )}
        </div>

        {/* Relationship */}
        <div className="space-y-2">
          <Label htmlFor="relationship">
            Relationship to Student <span className="text-destructive">*</span>
          </Label>
          <select
            id="relationship"
            {...register("relationship")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select relationship</option>
            {relationshipOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.relationship && (
            <p className="text-sm text-destructive">
              {errors.relationship.message}
            </p>
          )}
        </div>

        {/* CNIC */}
        <div className="space-y-2">
          <Label htmlFor="guardianCnic">
            CNIC Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="guardianCnic"
            {...register("guardianCnic")}
            placeholder="12345-1234567-1"
          />
          {errors.guardianCnic && (
            <p className="text-sm text-destructive">
              {errors.guardianCnic.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="guardianPhone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="guardianPhone"
            {...register("guardianPhone")}
            placeholder="03001234567"
          />
          {errors.guardianPhone && (
            <p className="text-sm text-destructive">
              {errors.guardianPhone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="guardianEmail">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="guardianEmail"
            type="email"
            {...register("guardianEmail")}
            placeholder="email@example.com"
          />
          {errors.guardianEmail && (
            <p className="text-sm text-destructive">
              {errors.guardianEmail.message}
            </p>
          )}
        </div>

        {/* Occupation */}
        <div className="space-y-2">
          <Label htmlFor="guardianOccupation">Occupation</Label>
          <Input
            id="guardianOccupation"
            {...register("guardianOccupation")}
            placeholder="e.g., Engineer, Doctor, Business"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">
            Residential Address <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="address"
            {...register("address")}
            rows={2}
            placeholder="House/Flat No., Street, Area"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input id="city" {...register("city")} placeholder="e.g., Karachi" />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="border-t pt-6 mt-6">
        <h3 className="font-medium mb-4">Emergency Contact (Other than Guardian)</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">
              Emergency Contact Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="emergencyContactName"
              {...register("emergencyContactName")}
              placeholder="Full name"
            />
            {errors.emergencyContactName && (
              <p className="text-sm text-destructive">
                {errors.emergencyContactName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">
              Emergency Contact Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="emergencyContactPhone"
              {...register("emergencyContactPhone")}
              placeholder="03001234567"
            />
            {errors.emergencyContactPhone && (
              <p className="text-sm text-destructive">
                {errors.emergencyContactPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

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
