import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://alnooracademy.edu.pk"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/academics`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admissions`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admissions/apply`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/student-life`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/staff`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  // Dynamic news pages
  let newsPages: MetadataRoute.Sitemap = []
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })

    newsPages = news.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch {
    // Database might not be available during build
    console.log("Unable to fetch news for sitemap")
  }

  // Dynamic staff pages
  let staffPages: MetadataRoute.Sitemap = []
  try {
    const staff = await prisma.staff.findMany({
      where: { isPublic: true },
      select: { id: true, createdAt: true },
    })

    staffPages = staff.map((member) => ({
      url: `${baseUrl}/staff/${member.id}`,
      lastModified: member.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  } catch {
    // Database might not be available during build
    console.log("Unable to fetch staff for sitemap")
  }

  return [...staticPages, ...newsPages, ...staffPages]
}
