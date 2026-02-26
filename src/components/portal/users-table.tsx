"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, Users } from "lucide-react"
import { format } from "date-fns"

type Role = "STUDENT" | "PARENT" | "TEACHER" | "ADMIN"

interface User {
  id: string
  email: string
  role: Role
  createdAt: string | Date
  student?: {
    firstName: string
    lastName: string
    gradeLevel: string
    profileImage?: string | null
  } | null
  parent?: {
    firstName: string
    lastName: string
  } | null
  teacher?: {
    firstName: string
    lastName: string
    subject: string
    profileImage?: string | null
  } | null
}

interface UsersTableProps {
  users: User[]
  title?: string
  description?: string
}

const roleColors: Record<Role, "default" | "secondary" | "destructive" | "outline"> = {
  ADMIN: "destructive",
  TEACHER: "default",
  PARENT: "secondary",
  STUDENT: "outline",
}

export function UsersTable({
  users,
  title = "Users",
  description,
}: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL")

  const filteredUsers = users.filter((user) => {
    const name = getUserName(user)
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  function getUserName(user: User): string {
    if (user.student) return `${user.student.firstName} ${user.student.lastName}`
    if (user.parent) return `${user.parent.firstName} ${user.parent.lastName}`
    if (user.teacher) return `${user.teacher.firstName} ${user.teacher.lastName}`
    return user.email.split("@")[0]
  }

  function getUserImage(user: User): string | null {
    if (user.student?.profileImage) return user.student.profileImage
    if (user.teacher?.profileImage) return user.teacher.profileImage
    return null
  }

  function getUserDetails(user: User): string {
    if (user.student) return `Grade ${user.student.gradeLevel}`
    if (user.teacher) return user.teacher.subject
    if (user.parent) return "Parent"
    return "Admin"
  }

  // Count by role
  const roleCounts = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {roleCounts["STUDENT"] || 0} Students
            </Badge>
            <Badge variant="outline">
              {roleCounts["PARENT"] || 0} Parents
            </Badge>
            <Badge variant="outline">
              {roleCounts["TEACHER"] || 0} Teachers
            </Badge>
            <Badge variant="outline">
              {roleCounts["ADMIN"] || 0} Admins
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as Role | "ALL")}
          >
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="STUDENT">Students</SelectItem>
              <SelectItem value="PARENT">Parents</SelectItem>
              <SelectItem value="TEACHER">Teachers</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const name = getUserName(user)
                  const image = getUserImage(user)
                  const initials = name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={image || ""} alt={name} />
                            <AvatarFallback className="text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleColors[user.role]}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {getUserDetails(user)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </CardContent>
    </Card>
  )
}
