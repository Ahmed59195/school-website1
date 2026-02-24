"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  studentInfoSchema,
  StudentInfo,
  gradeOptions,
  ApplicationData,
} from "@/lib/validations/application"
import { ChevronRight } from "lucide-react"

interface Step1Props {
  data: Partial<ApplicationData>
  onUpdate: (data: Partial<ApplicationData>) => void
  onNext: () => void
}

export function Step1StudentInfo({ data, onUpdate, onNext }: Step1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInfo>({
    resolver: zodResolver(studentInfoSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      dateOfBirth: data.dateOfBirth || "",
      gender: data.gender,
      gradeApplying: data.gradeApplying || "",
      previousSchool: data.previousSchool || "",
      previousGrade: data.previousGrade || "",
      medicalConditions: data.medicalConditions || "",
    },
  })

  const onSubmit = (formData: StudentInfo) => {
    onUpdate(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Student Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide the student&apos;s personal details
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>
            Gender <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="male"
                {...register("gender")}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Male</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="female"
                {...register("gender")}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Female</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        {/* Grade Applying For */}
        <div className="space-y-2">
          <Label htmlFor="gradeApplying">
            Grade Applying For <span className="text-destructive">*</span>
          </Label>
          <select
            id="gradeApplying"
            {...register("gradeApplying")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select grade</option>
            {gradeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.gradeApplying && (
            <p className="text-sm text-destructive">
              {errors.gradeApplying.message}
            </p>
          )}
        </div>

        {/* Previous School */}
        <div className="space-y-2">
          <Label htmlFor="previousSchool">Previous School</Label>
          <Input
            id="previousSchool"
            {...register("previousSchool")}
            placeholder="Name of previous school (if any)"
          />
        </div>

        {/* Previous Grade */}
        <div className="space-y-2">
          <Label htmlFor="previousGrade">Previous Grade Completed</Label>
          <Input
            id="previousGrade"
            {...register("previousGrade")}
            placeholder="e.g., Grade 3"
          />
        </div>

        {/* Medical Conditions */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="medicalConditions">
            Medical Conditions / Allergies
          </Label>
          <textarea
            id="medicalConditions"
            {...register("medicalConditions")}
            rows={3}
            placeholder="Please mention any medical conditions, allergies, or special needs"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
