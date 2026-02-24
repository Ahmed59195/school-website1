"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Announcement {
  id: string
  title: string
  href: string
}

export function AnnouncementsTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/announcements")
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data.announcements || [])
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error)
      }
    }
    fetchAnnouncements()
  }, [])

  useEffect(() => {
    if (announcements.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [announcements.length])

  if (announcements.length === 0) {
    return null
  }

  const currentAnnouncement = announcements[currentIndex]

  return (
    <div className="bg-primary/5 border-y">
      <div className="container-custom py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bell className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm hidden sm:inline">
              Announcements
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div
              className="transition-transform duration-500"
              key={currentAnnouncement?.id}
            >
              {currentAnnouncement && (
                <Link
                  href={currentAnnouncement.href}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
                >
                  <span className="truncate">{currentAnnouncement.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              )}
            </div>
          </div>

          {announcements.length > 1 && (
            <div className="flex gap-1 shrink-0">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to announcement ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
