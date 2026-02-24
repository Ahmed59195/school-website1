import Link from "next/link"
import { ArrowRight, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-28 lg:py-36">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container-custom">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Excellence in Education Since 1999</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Empowering Minds,{" "}
            <span className="text-primary">Shaping Futures</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Al-Noor Academy provides world-class K-12 education, nurturing the
            leaders of tomorrow with academic excellence and strong values.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="w-full sm:w-auto group" asChild>
              <Link href="/admissions/apply">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8">
            <div className="rounded-lg border bg-background/60 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">1200+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="rounded-lg border bg-background/60 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">80+</div>
              <div className="text-sm text-muted-foreground">Teachers</div>
            </div>
            <div className="rounded-lg border bg-background/60 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
            <div className="rounded-lg border bg-background/60 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Pass Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
