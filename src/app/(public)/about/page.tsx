import { Metadata } from "next"
import { Target, Eye, Heart, Award, Users, Building } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About Us - Al-Noor Academy",
  description:
    "Learn about Al-Noor Academy's history, mission, vision, values, and our commitment to excellence in education.",
}

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We pursue the highest standards in everything we do.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We act with honesty, transparency, and ethical behavior.",
  },
  {
    icon: Users,
    title: "Respect",
    description: "We treat everyone with dignity and value diversity.",
  },
  {
    icon: Building,
    title: "Responsibility",
    description: "We are accountable for our actions and their impact.",
  },
]

const accreditations = [
  "Federal Board of Education",
  "Cambridge Assessment International Education",
  "Pakistan Education Foundation",
  "ISO 9001:2015 Certified",
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <div className="container-custom py-12">
        {/* History Section */}
        <section className="mb-16">
          <SectionHeader
            title="Our History"
            subtitle="A legacy of excellence in education since 1999"
            align="left"
          />
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              Al-Noor Academy was founded in 1999 with a vision to provide quality
              education that nurtures both intellectual growth and moral development.
              What started as a small school with just 50 students has grown into a
              premier educational institution serving over 1,200 students from
              Pre-Kindergarten through Grade 12.
            </p>
            <p>
              Over the past 25 years, we have consistently maintained our commitment
              to academic excellence while adapting to the evolving educational
              landscape. Our graduates have gone on to excel in top universities
              across Pakistan and around the world.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To provide quality education that develops the whole child -
                intellectually, spiritually, and socially. We are committed to
                creating a nurturing environment where students can discover their
                potential and develop the skills needed to succeed in a rapidly
                changing world.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading educational institution producing leaders who
                contribute positively to society. We envision a community of
                lifelong learners who embody excellence, integrity, and compassion
                in all aspects of their lives.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <SectionHeader
            title="Our Core Values"
            subtitle="The principles that guide our educational philosophy"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Principal's Message */}
        <section className="mb-16">
          <Card className="bg-muted/30">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="shrink-0">
                  <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-4xl font-bold text-muted-foreground/30">
                      AN
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Message from the Principal
                  </h2>
                  <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4">
                    &ldquo;At Al-Noor Academy, we believe that every child has
                    unique gifts and potential. Our role is to nurture these gifts
                    while building a strong foundation of knowledge, values, and
                    character. Education is not just about academic achievement; it
                    is about preparing young people to be responsible citizens and
                    compassionate human beings.&rdquo;
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-semibold">Dr. Ahmed Khan</p>
                    <p className="text-sm text-muted-foreground">
                      Principal, Al-Noor Academy
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Accreditations Section */}
        <section>
          <SectionHeader
            title="Accreditations & Affiliations"
            subtitle="Recognized by leading educational bodies"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accreditations.map((accreditation) => (
              <Card key={accreditation}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{accreditation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
