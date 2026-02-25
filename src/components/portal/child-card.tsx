import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, UserCheck, CreditCard, ChevronRight } from "lucide-react"

interface ChildData {
  id: string
  firstName: string
  lastName: string
  gradeLevel: string
  rollNumber: string
  profileImage?: string | null
  attendanceRate?: number
  pendingFees?: number
}

interface ChildCardProps {
  child: ChildData
}

export function ChildCard({ child }: ChildCardProps) {
  const initials = `${child.firstName.charAt(0)}${child.lastName.charAt(0)}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={child.profileImage || ""} alt={`${child.firstName} ${child.lastName}`} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {child.firstName} {child.lastName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{child.gradeLevel}</Badge>
              <span className="text-sm text-muted-foreground">
                Roll: {child.rollNumber}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="font-semibold">
                {child.attendanceRate !== undefined ? `${child.attendanceRate}%` : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Fees</p>
              <p className="font-semibold">
                {child.pendingFees !== undefined ? child.pendingFees : 0}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Button asChild className="w-full" variant="outline">
          <Link href={`/parent/child/${child.id}`}>
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
