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
import { cn } from "@/lib/utils"

interface Grade {
  id: string
  subject: string
  assessmentName: string
  score: number
  maxScore: number
  grade: string
  term: string
}

interface GradesTableProps {
  grades: Grade[]
  title?: string
  showTerm?: boolean
}

function getGradeColor(grade: string): string {
  switch (grade.toUpperCase()) {
    case "A+":
    case "A":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "A-":
    case "B+":
    case "B":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "B-":
    case "C+":
    case "C":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "C-":
    case "D+":
    case "D":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    default:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  }
}

export function GradesTable({
  grades,
  title = "Recent Grades",
  showTerm = false,
}: GradesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Assessment</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              {showTerm && <TableHead>Term</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showTerm ? 5 : 4} className="text-center text-muted-foreground">
                  No grades available
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.subject}</TableCell>
                  <TableCell>{grade.assessmentName}</TableCell>
                  <TableCell className="text-right">
                    {grade.score}/{grade.maxScore}
                    <span className="text-muted-foreground text-xs ml-1">
                      ({Math.round((grade.score / grade.maxScore) * 100)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={cn(getGradeColor(grade.grade))}>
                      {grade.grade}
                    </Badge>
                  </TableCell>
                  {showTerm && <TableCell>{grade.term}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
