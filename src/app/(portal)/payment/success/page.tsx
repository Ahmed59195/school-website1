"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentDetails {
  amount: number
  description: string
  studentName: string
  paidAt: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  )

  useEffect(() => {
    if (sessionId) {
      // Optionally fetch payment details from your API
      // For now, we'll just show a success message
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-lg py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>

          {paymentDetails && (
            <div className="rounded-lg bg-muted p-4 text-left">
              <h3 className="mb-2 font-semibold">Payment Details</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Amount:</dt>
                  <dd className="font-medium">
                    PKR {paymentDetails.amount.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Description:</dt>
                  <dd className="font-medium">{paymentDetails.description}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Student:</dt>
                  <dd className="font-medium">{paymentDetails.studentName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date:</dt>
                  <dd className="font-medium">
                    {new Date(paymentDetails.paidAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your registered email
              address.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/portal">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/portal/student">View Fee Status</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
