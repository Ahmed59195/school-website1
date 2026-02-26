"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams()
  const feeId = searchParams.get("fee_id")

  return (
    <div className="container max-w-lg py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <XCircle className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-2xl text-yellow-600 dark:text-yellow-400">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges have been made to your
            account.
          </p>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If you experienced any issues during the payment process, please
              contact our support team.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/portal">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/portal/student">Try Again</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
