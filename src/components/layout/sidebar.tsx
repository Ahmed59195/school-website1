"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Home,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  BookOpen,
  ClipboardList,
  UserCheck,
  FileText,
  BarChart3,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/student", icon: Home },
  { title: "Attendance", href: "/student/attendance", icon: UserCheck },
  { title: "Grades", href: "/student/grades", icon: GraduationCap },
  { title: "Schedule", href: "/student/schedule", icon: Calendar },
  { title: "Fees", href: "/student/fees", icon: CreditCard },
]

const parentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/parent", icon: Home },
  { title: "Children", href: "/parent/children", icon: Users },
  { title: "Notifications", href: "/parent/notifications", icon: Bell },
  { title: "Fees", href: "/parent/fees", icon: CreditCard },
]

const teacherNavItems: NavItem[] = [
  { title: "Dashboard", href: "/teacher", icon: Home },
  { title: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { title: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
  { title: "Grades", href: "/teacher/grades", icon: GraduationCap },
  { title: "Schedule", href: "/teacher/schedule", icon: Calendar },
]

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Students", href: "/admin/students", icon: GraduationCap },
  { title: "Teachers", href: "/admin/teachers", icon: BookOpen },
  { title: "Fees", href: "/admin/fees", icon: CreditCard },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

function getNavItems(role: string): NavItem[] {
  switch (role) {
    case "STUDENT":
      return studentNavItems
    case "PARENT":
      return parentNavItems
    case "TEACHER":
      return teacherNavItems
    case "ADMIN":
      return adminNavItems
    default:
      return []
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role || "STUDENT"
  const navItems = getNavItems(role)

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold">Al-Noor Academy</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={session?.user?.name || "User"} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {session?.user?.name || session?.user?.email}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {role.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="border-t p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          asChild
        >
          <Link href="/profile">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
