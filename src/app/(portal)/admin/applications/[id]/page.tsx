"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  User,
  Users,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

type ApplicationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED"

interface Application {
  id: string
  applicationNumber: string
  status: ApplicationStatus
  gradeApplying: string
  academicYear: string
  studentFirstName: string
  studentLastName: string
  studentDob: string
  studentGender: string
  previousSchool: string | null
  guardianFirstName: string
  guardianLastName: string
  guardianEmail: string
  guardianPhone: string
  guardianRelation: string
  guardianOccupation: string | null
  guardianAddress: string
  documents: any
  notes: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

const statusColors: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  REVIEWING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  WAITLISTED: "secondary",
}

const statusIcons = {
  PENDING: Clock,
  REVIEWING: AlertCircle,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  WAITLISTED: AlertCircle,
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<ApplicationStatus | "">("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    async function fetchApplication() {
      const { id } = await params
      try {
        const response = await fetch(`/api/admin/applications/${id}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        setApplication(data)
        setNotes(data.notes || "")
        setNewStatus(data.status)
      } catch (error) {
        toast.error("Failed to load application")
      } finally {
        setLoading(false)
      }
    }
    fetchApplication()
  }, [params])

  async function handleUpdate() {
    if (!application || !newStatus) return

    setUpdating(true)
    const { id } = await params
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes }),
      })

      if (!response.ok) throw new Error("Failed to update")

      const updated = await response.json()
      setApplication(updated)
      toast.success("Application updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update application")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Application not found</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/admin/applications">Back to Applications</Link>
        </Button>
      </div>
    )
  }

  const StatusIcon = statusIcons[application.status]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Application #{application.applicationNumber}
          </h1>
          <p className="text-muted-foreground">
            Submitted {format(new Date(application.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <Badge
          variant={statusColors[application.status]}
          className="text-sm px-3 py-1"
        >
          <StatusIcon className="mr-1 h-4 w-4" />
          {application.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">
                    {application.studentFirstName} {application.studentLastName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Grade Applying</Label>
                  <p className="font-medium">{application.gradeApplying}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <p className="font-medium">
                    {format(new Date(application.studentDob), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="font-medium">{application.studentGender}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Previous School</Label>
                  <p className="font-medium">
                    {application.previousSchool || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">
                    {application.guardianFirstName} {application.guardianLastName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Relationship</Label>
                  <p className="font-medium">{application.guardianRelation}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{application.guardianEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{application.guardianPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Occupation</Label>
                    <p className="font-medium">
                      {application.guardianOccupation || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{application.guardianAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          {application.documents && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {typeof application.documents === "object" &&
                Object.keys(application.documents).length > 0 ? (
                  <ul className="space-y-2">
                    {Object.entries(application.documents).map(([key, value]) => (
                      <li key={key} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        {typeof value === "string" && value.startsWith("http") ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          <span className="text-muted-foreground">
                            {String(value)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No documents uploaded</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Application</CardTitle>
              <CardDescription>Change status and add notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value) => setNewStatus(value as ApplicationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWING">Reviewing</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updating || newStatus === application.status && notes === (application.notes || "")}
                className="w-full"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Application
              </Button>
            </CardContent>
          </Card>

          {/* Review Info */}
          {application.reviewedAt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Label className="text-muted-foreground">Reviewed By</Label>
                  <p>{application.reviewedBy || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reviewed At</Label>
                  <p>
                    {format(
                      new Date(application.reviewedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-muted-foreground">
                    {format(new Date(application.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              {application.reviewedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Reviewed</p>
                    <p className="text-muted-foreground">
                      {format(new Date(application.reviewedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
