import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { format, isSameDay } from "date-fns"

interface EventCardProps {
  title: string
  description?: string | null
  startDate: Date | string
  endDate?: Date | string | null
  location?: string | null
  category?: string | null
  isAllDay?: boolean
}

export function EventCard({
  title,
  description,
  startDate,
  endDate,
  location,
  category,
  isAllDay = false,
}: EventCardProps) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  const formatEventTime = () => {
    if (isAllDay) return "All Day"

    const startTime = format(start, "h:mm a")
    if (!end) return startTime

    if (isSameDay(start, end)) {
      return `${startTime} - ${format(end, "h:mm a")}`
    }

    return `${format(start, "MMM d")} - ${format(end, "MMM d")}`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Date Badge */}
            <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg p-2 min-w-[60px]">
              <span className="text-xs uppercase">{format(start, "MMM")}</span>
              <span className="text-2xl font-bold">{format(start, "d")}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {category && (
                <Badge variant="secondary" className="mt-1">
                  {category}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatEventTime()}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
