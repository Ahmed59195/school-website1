import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsCard } from "@/components/news/news-card"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.news.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  })

  if (!article) {
    return { title: "Article Not Found" }
  }

  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  }
}

async function getArticle(slug: string) {
  const article = await prisma.news.findUnique({
    where: { slug, published: true },
  })

  if (!article) return null

  const related = await prisma.news.findMany({
    where: {
      published: true,
      category: article.category,
      id: { not: article.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  return { article, related }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params
  const data = await getArticle(slug)

  if (!data) {
    notFound()
  }

  const { article, related } = data

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Cover Image */}
          {article.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-6">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-6">
            <Badge variant="secondary" className="mb-3">
              {article.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(
                    new Date(article.publishedAt || article.createdAt),
                    "MMMM d, yyyy"
                  )}
                </span>
              </div>
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Related Articles */}
          {related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      {item.coverImage && (
                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded bg-muted">
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(
                            new Date(item.publishedAt || item.createdAt),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/news">All</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/news?category=General">General</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/news?category=Academic">Academic</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/news?category=Sports">Sports</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/news?category=Events">Events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
