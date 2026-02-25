import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, ClipboardList, GraduationCap, ChevronRight } from "lucide-react"

interface ClassData {
  id: string
  name: string
  grade: string
  section: string
  subject: string
  studentCount?: number
}

interface ClassListProps {
  classes: ClassData[]
  title?: string
}

export function ClassList({ classes, title = "My Classes" }: ClassListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No classes assigned
          </p>
        ) : (
          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{cls.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{cls.grade}</Badge>
                      <Badge variant="outline">Section {cls.section}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {cls.subject}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cls.studentCount !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mr-4">
                      <Users className="h-4 w-4" />
                      {cls.studentCount} students
                    </div>
                  )}
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/teacher/class/${cls.id}/attendance`}>
                      <ClipboardList className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/teacher/class/${cls.id}/grades`}>
                      <GraduationCap className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/teacher/class/${cls.id}`}>
                      View
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
