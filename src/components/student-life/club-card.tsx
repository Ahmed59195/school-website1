import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface ClubCardProps {
  name: string
  description: string
  category?: string
  memberCount?: number
  meetingDay?: string
  image?: string
}

export function ClubCard({
  name,
  description,
  category,
  memberCount,
  meetingDay,
  image,
}: ClubCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{name}</CardTitle>
          {category && (
            <Badge variant="secondary" className="shrink-0">
              {category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {memberCount !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
          )}
          {meetingDay && (
            <span>Meets: {meetingDay}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
