"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { NewsCard } from "@/components/news/news-card"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  imageUrl?: string
  slug: string
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=3")
        if (res.ok) {
          const data = await res.json()
          setNews(data.news || [])
        }
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <SectionHeader
          title="Latest News & Events"
          subtitle="Stay updated with the latest happenings at Al-Noor Academy"
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  category={item.category}
                  publishedAt={item.publishedAt}
                  imageUrl={item.imageUrl}
                  slug={item.slug}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" className="group" asChild>
                <Link href="/news">
                  View All News
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No news articles available at the moment.
          </div>
        )}
      </div>
    </section>
  )
}
