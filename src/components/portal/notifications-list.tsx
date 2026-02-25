"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Info, AlertTriangle, CreditCard, GraduationCap, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type NotificationType = "INFO" | "WARNING" | "SUCCESS" | "FEE" | "GRADE" | "ATTENDANCE"

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: Date
  link?: string | null
}

interface NotificationsListProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "WARNING":
      return AlertTriangle
    case "SUCCESS":
      return Check
    case "FEE":
      return CreditCard
    case "GRADE":
      return GraduationCap
    case "ATTENDANCE":
      return UserCheck
    default:
      return Info
  }
}

function getNotificationColor(type: NotificationType) {
  switch (type) {
    case "WARNING":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    case "SUCCESS":
      return "text-green-600 bg-green-100 dark:bg-green-900/20"
    case "FEE":
      return "text-red-600 bg-red-100 dark:bg-red-900/20"
    case "GRADE":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    case "ATTENDANCE":
      return "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
  }
}

export function NotificationsList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsListProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No notifications
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const colorClass = getNotificationColor(notification.type)

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 rounded-lg border p-3 transition-colors",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className={cn("rounded-full p-2 shrink-0", colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={cn("font-medium", !notification.read && "font-semibold")}>
                        {notification.title}
                      </h4>
                      {!notification.read && onMarkAsRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
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
