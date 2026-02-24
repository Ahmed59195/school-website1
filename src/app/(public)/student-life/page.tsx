import { Metadata } from "next"
import {
  Trophy,
  Music,
  Palette,
  Code,
  Dumbbell,
  BookOpen,
  Users,
  Heart,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Student Life - Al-Noor Academy",
  description:
    "Discover the vibrant student life at Al-Noor Academy including clubs, sports, arts, and extracurricular activities.",
}

const activities = [
  {
    icon: Trophy,
    title: "Sports & Athletics",
    description:
      "Cricket, football, basketball, volleyball, table tennis, and athletics programs with inter-school competitions.",
    items: ["Cricket Team", "Football Team", "Basketball", "Swimming", "Athletics"],
  },
  {
    icon: Music,
    title: "Music & Drama",
    description:
      "Nasheed club, drama society, and annual performances that showcase student talent.",
    items: ["Nasheed Club", "Drama Society", "Annual Play", "Choir"],
  },
  {
    icon: Palette,
    title: "Arts & Crafts",
    description:
      "Art club, calligraphy, and creative workshops that nurture artistic expression.",
    items: ["Art Club", "Calligraphy", "Pottery", "Photography"],
  },
  {
    icon: Code,
    title: "Technology & Innovation",
    description:
      "Robotics club, coding workshops, and STEM activities for future innovators.",
    items: ["Robotics Club", "Coding Club", "Science Club", "Math Olympiad"],
  },
  {
    icon: BookOpen,
    title: "Literary Activities",
    description:
      "Debate society, creative writing, and literary competitions in English and Urdu.",
    items: ["Debate Society", "Creative Writing", "Book Club", "School Magazine"],
  },
  {
    icon: Heart,
    title: "Community Service",
    description:
      "Social awareness programs and community service initiatives that build character.",
    items: ["Charity Drives", "Environmental Club", "Peer Tutoring", "Visits to Orphanages"],
  },
]

const facilities = [
  {
    title: "Modern Library",
    description: "Extensive collection of books, digital resources, and quiet study spaces.",
  },
  {
    title: "Science Laboratories",
    description: "Fully equipped physics, chemistry, biology, and computer labs.",
  },
  {
    title: "Sports Complex",
    description: "Indoor and outdoor facilities including basketball court, cricket ground, and gymnasium.",
  },
  {
    title: "Auditorium",
    description: "500-seat auditorium for assemblies, performances, and events.",
  },
  {
    title: "Art Studio",
    description: "Dedicated space for visual arts, crafts, and creative projects.",
  },
  {
    title: "Cafeteria",
    description: "Clean cafeteria serving healthy meals and snacks.",
  },
]

const events = [
  { name: "Annual Sports Day", month: "February" },
  { name: "Science Fair", month: "March" },
  { name: "Independence Day Celebration", month: "August" },
  { name: "Annual Drama Production", month: "October" },
  { name: "Eid Milad-un-Nabi", month: "September" },
  { name: "Annual Prize Distribution", month: "December" },
]

export default function StudentLifePage() {
  return (
    <>
      <PageHeader
        title="Student Life"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Student Life" }]}
      />

      <div className="container-custom py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              Life Beyond the Classroom
            </h2>
            <p className="text-muted-foreground text-lg">
              At Al-Noor Academy, we believe education extends far beyond
              textbooks. Our vibrant student life program offers numerous
              opportunities for personal growth, creativity, and leadership
              development.
            </p>
          </div>
        </section>

        {/* Extracurricular Activities */}
        <section className="mb-16">
          <SectionHeader
            title="Extracurricular Activities"
            subtitle="Diverse opportunities to explore interests and develop talents"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Card key={activity.title} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <activity.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{activity.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activity.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Facilities */}
        <section className="mb-16">
          <SectionHeader
            title="Campus Facilities"
            subtitle="Modern infrastructure to support learning and growth"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <Card key={facility.title}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{facility.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Annual Events */}
        <section className="mb-16">
          <SectionHeader
            title="Annual Events"
            subtitle="Memorable celebrations throughout the academic year"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.name}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.month}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Student Support */}
        <section>
          <Card className="bg-muted/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Student Support Services</h2>
              <p className="text-muted-foreground mb-6">
                We are committed to the well-being and success of every student.
                Our support services include:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Academic Counseling</p>
                    <p className="text-sm text-muted-foreground">
                      Guidance for academic planning and career choices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Peer Tutoring</p>
                    <p className="text-sm text-muted-foreground">
                      Student-led academic support programs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Health Services</p>
                    <p className="text-sm text-muted-foreground">
                      On-campus medical room and nurse
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Special Needs Support</p>
                    <p className="text-sm text-muted-foreground">
                      Individual learning plans for students who need them
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}
