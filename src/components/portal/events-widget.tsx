import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  description?: string | null
  startDate: Date
  endDate?: Date | null
  location?: string | null
  category?: string | null
  isAllDay?: boolean
}

interface EventsWidgetProps {
  events: Event[]
  title?: string
}

export function EventsWidget({ events, title = "Upcoming Events" }: EventsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No upcoming events
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                {/* Date badge */}
                <div className="flex flex-col items-center justify-center min-w-[50px] rounded bg-primary/10 p-2">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(event.startDate), "MMM")}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {format(new Date(event.startDate), "d")}
                  </span>
                </div>

                {/* Event details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    {event.category && (
                      <Badge variant="outline" className="shrink-0">
                        {event.category}
                      </Badge>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {!event.isAllDay && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.startDate), "h:mm a")}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
