import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  category: string
  coverImage?: string | null
  author?: string | null
  publishedAt?: Date | string | null
  createdAt: Date | string
}

interface NewsGridProps {
  news: NewsItem[]
  columns?: 2 | 3 | 4
}

export function NewsGrid({ news, columns = 3 }: NewsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No news articles found
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {news.map((item) => (
        <Link key={item.id} href={`/news/${item.slug}`}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
            {item.coverImage && (
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{item.category}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(
                    new Date(item.publishedAt || item.createdAt),
                    "MMM d, yyyy"
                  )}
                </span>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              {item.excerpt && (
                <CardDescription className="line-clamp-3">
                  {item.excerpt}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {item.author && (
                  <span className="text-sm text-muted-foreground">
                    By {item.author}
                  </span>
                )}
                <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
