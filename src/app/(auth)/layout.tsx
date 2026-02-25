import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 px-4">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">Al-Noor Academy</span>
        </Link>
        <p className="text-muted-foreground text-sm">Empowering Minds, Shaping Futures</p>
      </div>
      {children}
    </div>
  )
}
