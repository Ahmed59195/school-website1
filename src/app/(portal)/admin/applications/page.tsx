import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { FileText, Search, Filter } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ApplicationsTable } from "@/components/portal/applications-table"

export const metadata: Metadata = {
  title: "Applications - Admin",
  description: "Manage admission applications",
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

async function getApplications(status?: string, page: number = 1) {
  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {}
  if (status && status !== "ALL") {
    where.status = status
  }

  const [applications, total, statusCounts] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.application.count({ where }),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
  ])

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    statusCounts: statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = item._count
        return acc
      },
      {} as Record<string, number>
    ),
  }
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const { status, page } = await searchParams
  const pageNum = parseInt(page || "1")
  const data = await getApplications(status, pageNum)

  const totalAll = Object.values(data.statusCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Manage admission applications
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!status || status === "ALL" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/applications">
            All ({totalAll})
          </Link>
        </Button>
        <Button
          variant={status === "PENDING" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/applications?status=PENDING">
            Pending ({data.statusCounts["PENDING"] || 0})
          </Link>
        </Button>
        <Button
          variant={status === "REVIEWING" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/applications?status=REVIEWING">
            Reviewing ({data.statusCounts["REVIEWING"] || 0})
          </Link>
        </Button>
        <Button
          variant={status === "APPROVED" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/applications?status=APPROVED">
            Approved ({data.statusCounts["APPROVED"] || 0})
          </Link>
        </Button>
        <Button
          variant={status === "REJECTED" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/applications?status=REJECTED">
            Rejected ({data.statusCounts["REJECTED"] || 0})
          </Link>
        </Button>
        <Button
          variant={status === "WAITLISTED" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/applications?status=WAITLISTED">
            Waitlisted ({data.statusCounts["WAITLISTED"] || 0})
          </Link>
        </Button>
      </div>

      {/* Applications Table */}
      <ApplicationsTable
        applications={data.applications}
        showActions
      />

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pageNum === 1}
            asChild
          >
            <Link
              href={`/admin/applications?${status ? `status=${status}&` : ""}page=${pageNum - 1}`}
            >
              Previous
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNum} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pageNum === data.pagination.totalPages}
            asChild
          >
            <Link
              href={`/admin/applications?${status ? `status=${status}&` : ""}page=${pageNum + 1}`}
            >
              Next
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
