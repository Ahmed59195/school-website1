import { HeroSection } from "@/components/home/hero-section"
import { AnnouncementsTicker } from "@/components/home/announcements-ticker"
import { StatsSection } from "@/components/home/stats-section"
import { AboutPreview } from "@/components/home/about-preview"
import { NewsSection } from "@/components/home/news-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <AnnouncementsTicker />
      <HeroSection />
      <StatsSection />
      <AboutPreview />
      <NewsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
