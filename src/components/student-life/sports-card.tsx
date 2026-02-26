import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar } from "lucide-react"

interface SportsTeamCardProps {
  name: string
  sport: string
  description?: string
  coach?: string
  season?: string
  achievements?: string[]
  image?: string
}

export function SportsTeamCard({
  name,
  sport,
  description,
  coach,
  season,
  achievements = [],
  image,
}: SportsTeamCardProps) {
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
          <Badge variant="outline">{sport}</Badge>
        </div>
        {description && (
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {coach && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Coach: {coach}</span>
            </div>
          )}
          {season && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{season}</span>
            </div>
          )}
        </div>
        {achievements.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Achievements
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {achievements.slice(0, 3).map((achievement, index) => (
                <li key={index} className="truncate">• {achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
