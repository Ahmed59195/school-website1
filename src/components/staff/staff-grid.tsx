"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { StaffCard } from "./staff-card"

interface StaffMember {
  id: string
  name: string
  designation: string
  department: string
  image?: string | null
  email: string
  phone?: string | null
  bio?: string | null
}

interface StaffGridProps {
  staff: StaffMember[]
}

export function StaffGrid({ staff }: StaffGridProps) {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState<string>("all")

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(staff.map((s) => s.department))
    return Array.from(depts).sort()
  }, [staff])

  // Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        search === "" ||
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.designation.toLowerCase().includes(search.toLowerCase())

      const matchesDepartment =
        department === "all" || member.department === department

      return matchesSearch && matchesDepartment
    })
  }, [staff, search, department])

  // Group by department
  const groupedStaff = useMemo(() => {
    if (department !== "all") {
      return { [department]: filteredStaff }
    }

    return filteredStaff.reduce(
      (acc, member) => {
        if (!acc[member.department]) {
          acc[member.department] = []
        }
        acc[member.department].push(member)
        return acc
      },
      {} as Record<string, StaffMember[]>
    )
  }, [filteredStaff, department])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredStaff.length} of {staff.length} staff members
      </p>

      {/* Staff Grid grouped by department */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No staff members found matching your criteria
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedStaff)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dept, members]) => (
              <div key={dept}>
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">
                  {dept}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {members.map((member) => (
                    <StaffCard
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      designation={member.designation}
                      department={member.department}
                      image={member.image}
                      email={member.email}
                      phone={member.phone}
                      bio={member.bio}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
