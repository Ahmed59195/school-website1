"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { NewsCard } from "@/components/news/news-card"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Newspaper } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  imageUrl?: string
  slug: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

const categories = [
  "All",
  "News",
  "Events",
  "Announcements",
  "Achievements",
  "Sports",
]

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  })
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    fetchNews()
  }, [pagination.page, selectedCategory])

  async function fetchNews() {
    setLoading(true)
    try {
      const categoryParam =
        selectedCategory !== "All" ? `&category=${selectedCategory}` : ""
      const res = await fetch(
        `/api/news?page=${pagination.page}&limit=${pagination.limit}${categoryParam}`
      )
      if (res.ok) {
        const data = await res.json()
        setNews(data.news || [])
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }))
      }
    } catch (error) {
      console.error("Failed to fetch news:", error)
    } finally {
      setLoading(false)
    }
  }

  function handlePageChange(newPage: number) {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <>
      <PageHeader
        title="News & Events"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />

      <div className="container-custom py-12">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Newspaper}
            title="No news found"
            description={
              selectedCategory !== "All"
                ? `No news articles found in the "${selectedCategory}" category.`
                : "No news articles have been published yet. Check back soon!"
            }
            action={
              selectedCategory !== "All"
                ? {
                    label: "View all news",
                    onClick: () => handleCategoryChange("All"),
                  }
                : undefined
            }
          />
        )}
      </div>
    </>
  )
}
