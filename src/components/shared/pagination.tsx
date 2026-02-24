"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  className?: string
  onPageChange?: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  className,
  onPageChange,
}: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `${pathname}?${params.toString()}`
  }

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (showEllipsisStart) {
      pages.push("ellipsis")
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (showEllipsisEnd) {
      pages.push("ellipsis")
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  const handleClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  // Use callback mode if onPageChange is provided
  const useCallbackMode = !!onPageChange

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {useCallbackMode ? (
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          asChild={currentPage > 1}
          disabled={currentPage <= 1}
        >
          {currentPage > 1 ? (
            <Link href={createPageUrl(currentPage - 1)} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
        </Button>
      )}

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          )
        }

        const isCurrentPage = page === currentPage

        if (useCallbackMode) {
          return (
            <Button
              key={page}
              variant={isCurrentPage ? "default" : "outline"}
              size="icon"
              className={cn("h-9 w-9", isCurrentPage && "pointer-events-none")}
              onClick={() => handleClick(page)}
              disabled={isCurrentPage}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {page}
            </Button>
          )
        }

        return (
          <Button
            key={page}
            variant={isCurrentPage ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-9 w-9",
              isCurrentPage && "pointer-events-none"
            )}
            asChild={!isCurrentPage}
            aria-current={isCurrentPage ? "page" : undefined}
          >
            {isCurrentPage ? (
              <span>{page}</span>
            ) : (
              <Link href={createPageUrl(page)}>{page}</Link>
            )}
          </Button>
        )
      })}

      {/* Next Button */}
      {useCallbackMode ? (
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          asChild={currentPage < totalPages}
          disabled={currentPage >= totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={createPageUrl(currentPage + 1)} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      )}
    </nav>
  )
}
