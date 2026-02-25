"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"

interface Student {
  id: string
  firstName: string
  lastName: string
  rollNumber: string
  profileImage?: string | null
}

interface AttendanceRecord {
  studentId: string
  status: AttendanceStatus
}

interface AttendanceFormProps {
  classId: string
  className: string
  date: Date
  students: Student[]
  existingAttendance?: AttendanceRecord[]
  onSubmit?: (records: AttendanceRecord[]) => Promise<void>
}

const statusOptions: { value: AttendanceStatus; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: "PRESENT", label: "Present", icon: CheckCircle2, color: "text-green-600" },
  { value: "ABSENT", label: "Absent", icon: XCircle, color: "text-red-600" },
  { value: "LATE", label: "Late", icon: Clock, color: "text-yellow-600" },
  { value: "EXCUSED", label: "Excused", icon: AlertCircle, color: "text-blue-600" },
]

export function AttendanceForm({
  classId,
  className,
  date,
  students,
  existingAttendance = [],
  onSubmit,
}: AttendanceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {}
    students.forEach((student) => {
      const existing = existingAttendance.find((a) => a.studentId === student.id)
      initial[student.id] = existing?.status || "PRESENT"
    })
    return initial
  })

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleMarkAll = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {}
    students.forEach((student) => {
      newAttendance[student.id] = status
    })
    setAttendance(newAttendance)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const records: AttendanceRecord[] = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }))

      if (onSubmit) {
        await onSubmit(records)
      } else {
        // Default API call
        const response = await fetch(`/api/teachers/me/classes/${classId}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: date.toISOString(), records }),
        })

        if (!response.ok) throw new Error("Failed to save attendance")
      }

      toast.success("Attendance saved successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to save attendance")
    } finally {
      setIsSubmitting(false)
    }
  }

  const presentCount = Object.values(attendance).filter((s) => s === "PRESENT").length
  const absentCount = Object.values(attendance).filter((s) => s === "ABSENT").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <span>{className}</span>
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <div className="flex gap-2">
            <Badge variant="default">{presentCount} Present</Badge>
            <Badge variant="destructive">{absentCount} Absent</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => handleMarkAll("PRESENT")}>
            Mark All Present
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMarkAll("ABSENT")}>
            Mark All Absent
          </Button>
        </div>

        {/* Student List */}
        <div className="space-y-2">
          {students.map((student) => {
            const status = attendance[student.id]
            const statusConfig = statusOptions.find((s) => s.value === status)

            return (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
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
                <div className="flex items-center gap-2">
                  {statusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={status === option.value ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        status === option.value && option.color.replace("text-", "bg-").replace("-600", "-500")
                      )}
                      onClick={() => handleStatusChange(student.id, option.value)}
                    >
                      <option.icon className="h-4 w-4 mr-1" />
                      {option.label}
                    </Button>
                  ))}
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
          Save Attendance
        </Button>
      </CardFooter>
    </Card>
  )
}
