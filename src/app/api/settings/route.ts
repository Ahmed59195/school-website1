import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      select: {
        key: true,
        value: true,
      },
    })

    const settingsMap = settings.reduce<Record<string, unknown>>(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {}
    )

    return NextResponse.json({ settings: settingsMap })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}
