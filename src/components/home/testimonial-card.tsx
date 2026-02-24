import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  content: string
  authorName: string
  authorRole: string
  authorImage?: string
}

export function TestimonialCard({
  content,
  authorName,
  authorRole,
  authorImage,
}: TestimonialCardProps) {
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col p-6">
        {/* Quote Icon */}
        <Quote className="h-8 w-8 text-primary/20 mb-4" />

        {/* Content */}
        <blockquote className="flex-1 text-muted-foreground italic">
          &ldquo;{content}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {authorImage && <AvatarImage src={authorImage} alt={authorName} />}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{authorName}</div>
            <div className="text-xs text-muted-foreground">{authorRole}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
