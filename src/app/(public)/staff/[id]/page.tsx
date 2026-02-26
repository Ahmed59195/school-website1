import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Building } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StaffCard } from "@/components/staff/staff-card"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const staff = await prisma.staff.findUnique({
    where: { id, isPublic: true },
    select: { name: true, designation: true, bio: true },
  })

  if (!staff) {
    return { title: "Staff Member Not Found" }
  }

  return {
    title: `${staff.name} - ${staff.designation}`,
    description: staff.bio || `Learn more about ${staff.name} at Al-Noor Academy`,
  }
}

async function getStaffMember(id: string) {
  const staff = await prisma.staff.findUnique({
    where: { id, isPublic: true },
  })

  if (!staff) return null

  const colleagues = await prisma.staff.findMany({
    where: {
      isPublic: true,
      department: staff.department,
      id: { not: staff.id },
    },
    orderBy: { order: "asc" },
    take: 4,
  })

  return { staff, colleagues }
}

export default async function StaffProfilePage({ params }: PageProps) {
  const { id } = await params
  const data = await getStaffMember(id)

  if (!data) {
    notFound()
  }

  const { staff, colleagues } = data

  const initials = staff.name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/staff">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff Directory
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32 mx-auto md:mx-0">
                  <AvatarImage src={staff.image || ""} alt={staff.name} />
                  <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">{staff.name}</h1>
                  <p className="text-xl text-primary mt-1">{staff.designation}</p>
                  <Badge variant="secondary" className="mt-2">
                    <Building className="mr-1 h-3 w-3" />
                    {staff.department}
                  </Badge>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                    {staff.email && (
                      <a
                        href={`mailto:${staff.email}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {staff.email}
                      </a>
                    )}
                    {staff.phone && (
                      <a
                        href={`tel:${staff.phone}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {staff.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {staff.bio && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-3">About</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {staff.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staff.email && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${staff.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </a>
                </Button>
              )}
              {staff.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${staff.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call {staff.phone}
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Colleagues */}
          {colleagues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {staff.department} Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {colleagues.map((colleague) => (
                    <Link
                      key={colleague.id}
                      href={`/staff/${colleague.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={colleague.image || ""} alt={colleague.name} />
                        <AvatarFallback>
                          {colleague.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{colleague.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {colleague.designation}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
