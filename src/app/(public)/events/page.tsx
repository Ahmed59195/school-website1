import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/page-header"
import { EventsCalendar } from "@/components/events/events-calendar"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Events - Al-Noor Academy",
  description: "View upcoming events and activities at Al-Noor Academy",
}

async function getEvents() {
  const now = new Date()

  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: {
        isPublic: true,
        startDate: { gte: now },
      },
      orderBy: { startDate: "asc" },
      take: 50,
    }),
    prisma.event.findMany({
      where: {
        isPublic: true,
        startDate: { lt: now },
      },
      orderBy: { startDate: "desc" },
      take: 20,
    }),
  ])

  return { upcoming, past, all: [...upcoming, ...past] }
}

export default async function EventsPage() {
  const { upcoming, past, all } = await getEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Events"
        subtitle="Stay updated with school events, activities, and important dates"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events" },
        ]}
      />

      <Tabs defaultValue="calendar" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <EventsCalendar events={all} />
        </TabsContent>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming events scheduled
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  location={event.location}
                  category={event.category}
                  isAllDay={event.isAllDay}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No past events to display
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  location={event.location}
                  category={event.category}
                  isAllDay={event.isAllDay}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
