import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, User, Calendar, CreditCard, BookOpen, Mail, Phone, MapPin } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceSummary } from "@/components/portal/attendance-summary"
import { GradesTable } from "@/components/portal/grades-table"
import { FeesWidget } from "@/components/portal/fees-widget"
import { format } from "date-fns"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const student = await prisma.student.findUnique({
    where: { id },
    select: { firstName: true, lastName: true },
  })

  return {
    title: student ? `${student.firstName} ${student.lastName} - Details` : "Child Details",
    description: "View your child's academic progress, attendance, and fees",
  }
}

async function getChildData(parentId: string, childId: string) {
  // Verify parent-child relationship and get child data
  const parentStudent = await prisma.parentStudent.findUnique({
    where: {
      parentId_studentId: {
        parentId,
        studentId: childId,
      },
    },
    include: {
      student: {
        include: {
          user: {
            select: { email: true },
          },
          attendance: {
            orderBy: { date: "desc" },
            take: 50,
            include: {
              class: {
                select: { name: true, subject: true },
              },
            },
          },
          grades: {
            orderBy: [{ createdAt: "desc" }],
            take: 20,
            include: {
              class: {
                select: {
                  name: true,
                  teacher: {
                    select: { firstName: true, lastName: true },
                  },
                },
              },
            },
          },
          fees: {
            orderBy: { dueDate: "desc" },
            take: 10,
          },
        },
      },
    },
  })

  return parentStudent
}

export default async function ChildDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "PARENT") {
    redirect("/login")
  }

  const userId = (session.user as any).id as string
  const { id: childId } = await params

  // Get parent record
  const parent = await prisma.parent.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!parent) {
    redirect("/login")
  }

  const childData = await getChildData(parent.id, childId)

  if (!childData) {
    notFound()
  }

  const { student, relationship } = childData
  const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`

  // Calculate attendance summary
  const attendanceSummary = {
    present: student.attendance.filter((a) => a.status === "PRESENT").length,
    absent: student.attendance.filter((a) => a.status === "ABSENT").length,
    late: student.attendance.filter((a) => a.status === "LATE").length,
    excused: student.attendance.filter((a) => a.status === "EXCUSED").length,
    total: student.attendance.length,
  }

  // Transform grades for the table
  const gradesForTable = student.grades.map((g) => ({
    id: g.id,
    subject: g.subject,
    assessmentName: g.assessmentName,
    score: g.score,
    maxScore: g.maxScore,
    grade: g.grade,
    term: g.term,
  }))

  // Transform fees for widget
  const feesForWidget = student.fees.map((f) => ({
    id: f.id,
    description: f.description,
    amount: f.amount,
    dueDate: f.dueDate,
    status: f.status as "PENDING" | "PAID" | "OVERDUE" | "PARTIAL",
    paidAmount: f.paidAmount,
  }))

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/parent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Student Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 mx-auto md:mx-0">
              <AvatarImage src={student.profileImage || ""} alt={`${student.firstName} ${student.lastName}`} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary">{student.gradeLevel}</Badge>
                <Badge variant="outline">Roll: {student.rollNumber}</Badge>
                {relationship && (
                  <Badge variant="outline" className="bg-primary/10">
                    {relationship}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{student.user.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(student.dateOfBirth), "MMM d, yyyy")}</span>
                  </div>
                )}
                {student.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{student.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AttendanceSummary data={attendanceSummary} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {student.grades.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Assessments</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {student.grades.length > 0
                        ? Math.round(
                            student.grades.reduce(
                              (sum, g) => sum + (g.score / g.maxScore) * 100,
                              0
                            ) / student.grades.length
                          )
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                  </div>
                </div>
                {gradesForTable.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Latest Grade</h4>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <p className="font-medium">{gradesForTable[0].subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {gradesForTable[0].assessmentName}
                        </p>
                      </div>
                      <Badge variant="secondary">{gradesForTable[0].grade}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Fees</CardTitle>
            </CardHeader>
            <CardContent>
              {feesForWidget.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No fee records
                </p>
              ) : (
                <div className="space-y-2">
                  {feesForWidget.slice(0, 3).map((fee) => (
                    <div
                      key={fee.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div>
                        <p className="font-medium">{fee.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(fee.dueDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge
                        variant={fee.status === "PAID" ? "default" : "destructive"}
                      >
                        {fee.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <div className="space-y-6">
            <AttendanceSummary data={attendanceSummary} />
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {student.attendance.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No attendance records
                  </p>
                ) : (
                  <div className="space-y-2">
                    {student.attendance.slice(0, 20).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted"
                      >
                        <div>
                          <p className="font-medium">
                            {format(new Date(record.date), "EEEE, MMM d, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.class.name} - {record.class.subject}
                          </p>
                        </div>
                        <Badge
                          variant={
                            record.status === "PRESENT"
                              ? "default"
                              : record.status === "LATE"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-6">
          <GradesTable grades={gradesForTable} title="All Grades" showTerm />
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <FeesWidget fees={feesForWidget} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
