import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Fee {
  id: string
  description: string
  amount: number
  dueDate: Date
  status: "PENDING" | "PAID" | "OVERDUE" | "PARTIAL"
  paidAmount?: number
}

interface FeesWidgetProps {
  fees: Fee[]
  currency?: string
  onPayFee?: (feeId: string) => void
}

function getStatusConfig(status: Fee["status"]) {
  switch (status) {
    case "PAID":
      return {
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/20",
        label: "Paid",
      }
    case "OVERDUE":
      return {
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        label: "Overdue",
      }
    case "PARTIAL":
      return {
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
        label: "Partial",
      }
    default:
      return {
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
        label: "Pending",
      }
  }
}

function formatCurrency(amount: number, currency: string = "PKR"): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function FeesWidget({
  fees,
  currency = "PKR",
  onPayFee,
}: FeesWidgetProps) {
  const totalPending = fees
    .filter((f) => f.status !== "PAID")
    .reduce((sum, f) => sum + f.amount - (f.paidAmount || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Fee Status
          </span>
          {totalPending > 0 && (
            <span className="text-lg font-bold text-destructive">
              {formatCurrency(totalPending, currency)} due
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fees.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No fee records
          </p>
        ) : (
          <div className="space-y-3">
            {fees.map((fee) => {
              const config = getStatusConfig(fee.status)
              const isPending = fee.status !== "PAID"
              const remaining = fee.amount - (fee.paidAmount || 0)

              return (
                <div
                  key={fee.id}
                  className={cn(
                    "rounded-lg border p-3",
                    fee.status === "OVERDUE" && "border-destructive/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{fee.description}</h4>
                        <Badge
                          variant="secondary"
                          className={cn(config.bgColor, config.color)}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Amount: {formatCurrency(fee.amount, currency)}</span>
                        <span>Due: {format(new Date(fee.dueDate), "MMM d, yyyy")}</span>
                      </div>
                      {fee.status === "PARTIAL" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Remaining: {formatCurrency(remaining, currency)}
                        </p>
                      )}
                    </div>
                    {isPending && onPayFee && (
                      <Button
                        size="sm"
                        onClick={() => onPayFee(fee.id)}
                        className="shrink-0"
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
