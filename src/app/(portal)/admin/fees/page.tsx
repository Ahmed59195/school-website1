import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FeeSummary } from "@/components/portal/fee-summary"

export const metadata: Metadata = {
  title: "Fees - Admin",
  description: "Manage fee payments",
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

async function getFees(status?: string, page: number = 1) {
  const limit = 25
  const skip = (page - 1) * limit

  const where: any = {}
  if (status && status !== "ALL") {
    where.status = status
  }

  const [fees, total, totals, statusCounts] = await Promise.all([
    prisma.fee.findMany({
      where,
      orderBy: { dueDate: "desc" },
      skip,
      take: limit,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            gradeLevel: true,
          },
        },
      },
    }),
    prisma.fee.count({ where }),
    prisma.fee.aggregate({
      _sum: { amount: true, paidAmount: true },
    }),
    prisma.fee.groupBy({
      by: ["status"],
      _count: true,
      _sum: { amount: true },
    }),
  ])

  return {
    fees,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    totals: {
      totalAmount: totals._sum.amount || 0,
      collectedAmount: totals._sum.paidAmount || 0,
      pendingAmount: (totals._sum.amount || 0) - (totals._sum.paidAmount || 0),
    },
    statusCounts: statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = { count: item._count, amount: item._sum.amount || 0 }
        return acc
      },
      {} as Record<string, { count: number; amount: number }>
    ),
  }
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
  PARTIAL: "secondary",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default async function FeesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const { status, page } = await searchParams
  const pageNum = parseInt(page || "1")
  const data = await getFees(status, pageNum)

  const totalAll = Object.values(data.statusCounts).reduce((a, b) => a + b.count, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
        <p className="text-muted-foreground">
          Track and manage student fee payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totals.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAll} fee records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totals.collectedAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.statusCounts["PAID"]?.count || 0} paid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(data.totals.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(data.statusCounts["PENDING"]?.count || 0) + (data.statusCounts["PARTIAL"]?.count || 0)} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data.statusCounts["OVERDUE"]?.amount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.statusCounts["OVERDUE"]?.count || 0} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!status || status === "ALL" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/fees">All ({totalAll})</Link>
        </Button>
        <Button
          variant={status === "PENDING" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/fees?status=PENDING">
            Pending ({data.statusCounts["PENDING"]?.count || 0})
          </Link>
        </Button>
        <Button
          variant={status === "OVERDUE" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/fees?status=OVERDUE">
            Overdue ({data.statusCounts["OVERDUE"]?.count || 0})
          </Link>
        </Button>
        <Button
          variant={status === "PARTIAL" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/fees?status=PARTIAL">
            Partial ({data.statusCounts["PARTIAL"]?.count || 0})
          </Link>
        </Button>
        <Button
          variant={status === "PAID" ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href="/admin/fees?status=PAID">
            Paid ({data.statusCounts["PAID"]?.count || 0})
          </Link>
        </Button>
      </div>

      {/* Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Records</CardTitle>
          <CardDescription>
            Showing {data.fees.length} of {data.pagination.total} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.fees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No fee records found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {fee.student.firstName} {fee.student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {fee.student.gradeLevel} - {fee.student.rollNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{fee.description}</p>
                          {fee.term && (
                            <p className="text-sm text-muted-foreground">
                              {fee.term}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(fee.amount)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(fee.paidAmount)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(fee.dueDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[fee.status]}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
              href={`/admin/fees?${status ? `status=${status}&` : ""}page=${pageNum - 1}`}
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
              href={`/admin/fees?${status ? `status=${status}&` : ""}page=${pageNum + 1}`}
            >
              Next
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
