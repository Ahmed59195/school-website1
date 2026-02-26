import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { AnnouncementsTicker } from "@/components/home/announcements-ticker"
import { StatsSection } from "@/components/home/stats-section"
import { AboutPreview } from "@/components/home/about-preview"
import { NewsSection } from "@/components/home/news-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export const metadata: Metadata = {
  title: "Al-Noor Academy | Empowering Minds, Shaping Futures",
  description:
    "Al-Noor Academy is a premier K-12 educational institution in Lahore, Pakistan. We provide quality education rooted in Islamic values, preparing students for academic excellence and lifelong success.",
  keywords: [
    "Al-Noor Academy",
    "school",
    "education",
    "K-12",
    "Lahore",
    "Pakistan",
    "Islamic school",
    "private school",
    "admission",
  ],
}

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
