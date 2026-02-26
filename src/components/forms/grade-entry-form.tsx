"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Student {
  id: string
  firstName: string
  lastName: string
  rollNumber: string
  profileImage?: string | null
}

interface GradeRecord {
  studentId: string
  score: number
  grade: string
  remarks?: string
}

interface GradeEntryFormProps {
  classId: string
  className: string
  subject: string
  students: Student[]
  assessmentName?: string
  maxScore?: number
  term?: string
  existingGrades?: GradeRecord[]
  onSubmit?: (records: GradeRecord[], meta: { assessmentName: string; maxScore: number; term: string }) => Promise<void>
}

const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]

function calculateGrade(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100
  if (percentage >= 97) return "A+"
  if (percentage >= 93) return "A"
  if (percentage >= 90) return "A-"
  if (percentage >= 87) return "B+"
  if (percentage >= 83) return "B"
  if (percentage >= 80) return "B-"
  if (percentage >= 77) return "C+"
  if (percentage >= 73) return "C"
  if (percentage >= 70) return "C-"
  if (percentage >= 67) return "D+"
  if (percentage >= 60) return "D"
  return "F"
}

export function GradeEntryForm({
  classId,
  className,
  subject,
  students,
  assessmentName: initialAssessmentName = "",
  maxScore: initialMaxScore = 100,
  term: initialTerm = "Term 1",
  existingGrades = [],
  onSubmit,
}: GradeEntryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessmentName, setAssessmentName] = useState(initialAssessmentName)
  const [maxScore, setMaxScore] = useState(initialMaxScore)
  const [term, setTerm] = useState(initialTerm)

  const [grades, setGrades] = useState<Record<string, GradeRecord>>(() => {
    const initial: Record<string, GradeRecord> = {}
    students.forEach((student) => {
      const existing = existingGrades.find((g) => g.studentId === student.id)
      initial[student.id] = existing || {
        studentId: student.id,
        score: 0,
        grade: "F",
        remarks: "",
      }
    })
    return initial
  })

  const handleScoreChange = (studentId: string, score: number) => {
    const validScore = Math.min(Math.max(0, score), maxScore)
    const autoGrade = calculateGrade(validScore, maxScore)
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: validScore,
        grade: autoGrade,
      },
    }))
  }

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        grade,
      },
    }))
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }))
  }

  const handleSubmit = async () => {
    if (!assessmentName.trim()) {
      toast.error("Please enter an assessment name")
      return
    }

    setIsSubmitting(true)
    try {
      const records = Object.values(grades)

      if (onSubmit) {
        await onSubmit(records, { assessmentName, maxScore, term })
      } else {
        const response = await fetch(`/api/teachers/me/classes/${classId}/grades`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentName,
            maxScore,
            term,
            year: new Date().getFullYear(),
            records,
          }),
        })

        if (!response.ok) throw new Error("Failed to save grades")
      }

      toast.success("Grades saved successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to save grades")
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageScore = students.length > 0
    ? Object.values(grades).reduce((sum, g) => sum + g.score, 0) / students.length
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span>{className}</span>
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {subject}
            </span>
          </div>
          <Badge variant="secondary">
            Class Average: {averageScore.toFixed(1)} / {maxScore}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assessment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-muted">
          <div className="space-y-2">
            <Label htmlFor="assessmentName">Assessment Name *</Label>
            <Input
              id="assessmentName"
              placeholder="e.g., Midterm Exam"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxScore">Max Score</Label>
            <Input
              id="maxScore"
              type="number"
              min={1}
              max={1000}
              value={maxScore}
              onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Term</Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Term 1">Term 1</SelectItem>
                <SelectItem value="Term 2">Term 2</SelectItem>
                <SelectItem value="Term 3">Term 3</SelectItem>
                <SelectItem value="Final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student Grades */}
        <div className="space-y-3">
          {students.map((student) => {
            const studentGrade = grades[student.id]

            return (
              <div
                key={student.id}
                className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-4 items-center rounded-lg border p-4"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.profileImage || ""} />
                    <AvatarFallback>
                      {student.firstName.charAt(0)}
                      {student.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Roll: {student.rollNumber}
                    </p>
                  </div>
                </div>

                {/* Score Input */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">Score:</Label>
                  <Input
                    type="number"
                    min={0}
                    max={maxScore}
                    value={studentGrade.score}
                    onChange={(e) => handleScoreChange(student.id, parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">/ {maxScore}</span>
                </div>

                {/* Grade Select */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Grade:</Label>
                  <Select
                    value={studentGrade.grade}
                    onValueChange={(value) => handleGradeChange(student.id, value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remarks */}
                <div className="lg:hidden">
                  <Textarea
                    placeholder="Remarks (optional)"
                    value={studentGrade.remarks || ""}
                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
                <div className="hidden lg:block">
                  <Input
                    placeholder="Remarks"
                    value={studentGrade.remarks || ""}
                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Grades
        </Button>
      </CardFooter>
    </Card>
  )
}
