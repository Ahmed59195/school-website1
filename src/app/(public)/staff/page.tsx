import { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Staff Directory - Al-Noor Academy",
  description:
    "Meet our dedicated faculty and staff members at Al-Noor Academy.",
}

const leadership = [
  {
    name: "Dr. Ahmed Khan",
    role: "Principal",
    department: "Administration",
    email: "principal@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mrs. Fatima Hassan",
    role: "Vice Principal (Academics)",
    department: "Administration",
    email: "vp.academics@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mr. Imran Ali",
    role: "Vice Principal (Administration)",
    department: "Administration",
    email: "vp.admin@alnooracademy.edu.pk",
    image: null,
  },
]

const departmentHeads = [
  {
    name: "Dr. Sarah Ahmed",
    role: "Head of Science Department",
    department: "Science",
    email: "science@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mr. Kamran Sheikh",
    role: "Head of Mathematics Department",
    department: "Mathematics",
    email: "math@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mrs. Nadia Qureshi",
    role: "Head of Languages Department",
    department: "Languages",
    email: "languages@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mr. Tariq Mahmood",
    role: "Head of Social Studies",
    department: "Social Studies",
    email: "socialstudies@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Maulana Yusuf Rahman",
    role: "Head of Islamic Studies",
    department: "Islamic Studies",
    email: "islamicstudies@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mr. Asad Iqbal",
    role: "Head of Computer Science",
    department: "Computer Science",
    email: "cs@alnooracademy.edu.pk",
    image: null,
  },
]

const adminStaff = [
  {
    name: "Mrs. Sadia Malik",
    role: "Admissions Coordinator",
    department: "Admissions",
    email: "admissions@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mr. Faisal Khan",
    role: "Finance Manager",
    department: "Finance",
    email: "finance@alnooracademy.edu.pk",
    image: null,
  },
  {
    name: "Mrs. Ayesha Siddiqui",
    role: "Student Affairs Coordinator",
    department: "Student Affairs",
    email: "studentaffairs@alnooracademy.edu.pk",
    image: null,
  },
]

function StaffCard({
  name,
  role,
  department,
  email,
  image,
}: {
  name: string
  role: string
  department: string
  email: string
  image: string | null
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-primary text-sm font-medium mt-1">{role}</p>
        <p className="text-muted-foreground text-sm mt-1">{department}</p>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mt-3 transition-colors"
        >
          <Mail className="h-3 w-3" />
          {email}
        </a>
      </CardContent>
    </Card>
  )
}

export default function StaffPage() {
  return (
    <>
      <PageHeader
        title="Staff Directory"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff" }]}
      />

      <div className="container-custom py-12">
        {/* Leadership */}
        <section className="mb-16">
          <SectionHeader
            title="School Leadership"
            subtitle="Meet our administrative leadership team"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((staff) => (
              <StaffCard key={staff.name} {...staff} />
            ))}
          </div>
        </section>

        {/* Department Heads */}
        <section className="mb-16">
          <SectionHeader
            title="Department Heads"
            subtitle="Leading our academic departments"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departmentHeads.map((staff) => (
              <StaffCard key={staff.name} {...staff} />
            ))}
          </div>
        </section>

        {/* Administrative Staff */}
        <section>
          <SectionHeader
            title="Administrative Staff"
            subtitle="Supporting our school community"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adminStaff.map((staff) => (
              <StaffCard key={staff.name} {...staff} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
