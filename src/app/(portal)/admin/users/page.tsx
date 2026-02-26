import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UsersTable } from "@/components/portal/users-table"

export const metadata: Metadata = {
  title: "Users - Admin",
  description: "Manage all users",
}

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          gradeLevel: true,
          profileImage: true,
        },
      },
      parent: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      teacher: {
        select: {
          firstName: true,
          lastName: true,
          subject: true,
          profileImage: true,
        },
      },
    },
  })

  return users
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage all users in the system
        </p>
      </div>

      <UsersTable
        users={users}
        title="All Users"
        description="Search and filter users by role or name"
      />
    </div>
  )
}
