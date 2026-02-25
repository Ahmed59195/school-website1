import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"

interface AttendanceData {
  present: number
  absent: number
  late: number
  excused: number
  total: number
}

interface AttendanceSummaryProps {
  data: AttendanceData
}

export function AttendanceSummary({ data }: AttendanceSummaryProps) {
  const attendanceRate = data.total > 0
    ? Math.round((data.present / data.total) * 100)
    : 0

  const stats = [
    {
      label: "Present",
      value: data.present,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "Absent",
      value: data.absent,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      label: "Late",
      value: data.late,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      label: "Excused",
      value: data.excused,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Attendance Summary</span>
          <span className="text-2xl font-bold text-primary">{attendanceRate}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 rounded-lg p-3 ${stat.bgColor}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Total school days: {data.total}
        </p>
      </CardContent>
    </Card>
  )
}
