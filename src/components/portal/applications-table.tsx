import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type ApplicationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED"

interface Application {
  id: string
  applicationNumber: string
  studentFirstName: string
  studentLastName: string
  gradeApplying: string
  guardianEmail: string
  status: ApplicationStatus
  createdAt: Date
}

interface ApplicationsTableProps {
  applications: Application[]
  title?: string
  showViewAll?: boolean
}

function getStatusColor(status: ApplicationStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "REJECTED":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "REVIEWING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "WAITLISTED":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

export function ApplicationsTable({
  applications,
  title = "Recent Applications",
  showViewAll = true,
}: ApplicationsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        {showViewAll && (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/applications">View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application #</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.applicationNumber}</TableCell>
                  <TableCell>
                    {app.studentFirstName} {app.studentLastName}
                  </TableCell>
                  <TableCell>{app.gradeApplying}</TableCell>
                  <TableCell>{format(new Date(app.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(getStatusColor(app.status))}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
