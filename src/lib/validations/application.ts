import { z } from "zod"

// Step 1: Student Information
export const studentInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"], {
    message: "Please select a gender",
  }),
  gradeApplying: z.string().min(1, "Please select the grade applying for"),
  previousSchool: z.string().optional(),
  previousGrade: z.string().optional(),
  medicalConditions: z.string().optional(),
})

// Step 2: Guardian Information
export const guardianInfoSchema = z.object({
  guardianName: z.string().min(2, "Guardian name must be at least 2 characters"),
  relationship: z.string().min(1, "Please select relationship"),
  guardianCnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "Please enter a valid CNIC (e.g., 12345-1234567-1)"),
  guardianPhone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, "Please enter a valid Pakistani phone number"),
  guardianEmail: z.string().email("Please enter a valid email address"),
  guardianOccupation: z.string().optional(),
  address: z.string().min(10, "Please enter a complete address"),
  city: z.string().min(2, "City is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, "Please enter a valid Pakistani phone number"),
})

// Step 3: Documents
export const documentsSchema = z.object({
  birthCertificate: z.string().optional(),
  previousReportCard: z.string().optional(),
  guardianCnicCopy: z.string().optional(),
  photographs: z.array(z.string()).optional(),
  additionalDocuments: z.array(z.string()).optional(),
})

// Complete application schema
export const applicationSchema = z.object({
  // Student info
  ...studentInfoSchema.shape,
  // Guardian info
  ...guardianInfoSchema.shape,
  // Documents
  ...documentsSchema.shape,
  // Agreement
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export type StudentInfo = z.infer<typeof studentInfoSchema>
export type GuardianInfo = z.infer<typeof guardianInfoSchema>
export type Documents = z.infer<typeof documentsSchema>
export type ApplicationData = z.infer<typeof applicationSchema>

// Grade options
export const gradeOptions = [
  { value: "pre-k", label: "Pre-Kindergarten" },
  { value: "kg", label: "Kindergarten" },
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 4" },
  { value: "5", label: "Grade 5" },
  { value: "6", label: "Grade 6" },
  { value: "7", label: "Grade 7" },
  { value: "8", label: "Grade 8" },
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
]

export const relationshipOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "grandparent", label: "Grandparent" },
  { value: "other", label: "Other" },
]
