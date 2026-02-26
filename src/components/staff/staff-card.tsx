import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone } from "lucide-react"

interface StaffCardProps {
  id: string
  name: string
  designation: string
  department: string
  image?: string | null
  email?: string
  phone?: string | null
  bio?: string | null
  showLink?: boolean
}

export function StaffCard({
  id,
  name,
  designation,
  department,
  image,
  email,
  phone,
  bio,
  showLink = true,
}: StaffCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const content = (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
        <CardContent className="pt-6">
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={image || ""} alt={name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-primary font-medium">{designation}</p>
            <Badge variant="secondary" className="mt-2">
              {department}
            </Badge>
            {bio && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {bio}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              {email && (
                <a
                  href={`mailto:${email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )

  if (showLink) {
    return <Link href={`/staff/${id}`}>{content}</Link>
  }

  return content
}
