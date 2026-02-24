"use client"

import { useEffect, useState } from "react"
import { SectionHeader } from "@/components/shared/section-header"
import { TestimonialCard } from "./testimonial-card"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"

interface Testimonial {
  id: string
  content: string
  authorName: string
  authorRole: string
  authorImage?: string
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials?limit=3")
        if (res.ok) {
          const data = await res.json()
          setTestimonials(data.testimonials || [])
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container-custom">
        <SectionHeader
          title="What Our Community Says"
          subtitle="Hear from parents, students, and staff about their experience at Al-Noor Academy"
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                content={testimonial.content}
                authorName={testimonial.authorName}
                authorRole={testimonial.authorRole}
                authorImage={testimonial.authorImage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No testimonials available at the moment.
          </div>
        )}
      </div>
    </section>
  )
}
