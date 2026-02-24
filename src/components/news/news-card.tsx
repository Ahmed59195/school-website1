import Link from "next/link"
import { Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: Date | string
  imageUrl?: string
  slug: string
}

export function NewsCard({
  id,
  title,
  excerpt,
  category,
  publishedAt,
  imageUrl,
  slug,
}: NewsCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/news/${slug}`}>
        {/* Image */}
        <div className="aspect-video bg-muted overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-4xl font-bold text-muted-foreground/30">
                AN
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category Badge */}
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>

          {/* Date */}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <time dateTime={new Date(publishedAt).toISOString()}>
              {formatDate(publishedAt)}
            </time>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
