import Link from "next/link"
import { ArrowRight, Target, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"

export function AboutPreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <SectionHeader
              title="About Al-Noor Academy"
              subtitle="Nurturing young minds with quality education, Islamic values, and modern learning approaches since 1999."
              align="left"
            />

            <div className="space-y-6">
              {/* Mission */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Mission</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    To provide quality education that develops the whole child -
                    intellectually, spiritually, and socially.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Vision</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    To be the leading educational institution producing leaders
                    who contribute positively to society.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Values</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Excellence, integrity, respect, responsibility, and
                    compassion guide everything we do.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="group mt-8" asChild>
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden">
              <img
                src="/images/campus/main-building.svg"
                alt="Al-Noor Academy Campus"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-primary/10 -z-10" />
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-xl bg-primary/5 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
