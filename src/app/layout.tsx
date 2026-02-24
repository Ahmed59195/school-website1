import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Al-Noor Academy | Empowering Minds, Shaping Futures",
    template: "%s | Al-Noor Academy",
  },
  description:
    "Al-Noor Academy is a premier K-12 educational institution dedicated to nurturing young minds with quality education, Islamic values, and modern learning.",
  keywords: [
    "Al-Noor Academy",
    "school",
    "education",
    "K-12",
    "Karachi",
    "Pakistan",
    "Islamic school",
  ],
  authors: [{ name: "Al-Noor Academy" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alnooracademy.edu.pk",
    siteName: "Al-Noor Academy",
    title: "Al-Noor Academy | Empowering Minds, Shaping Futures",
    description:
      "Premier K-12 educational institution dedicated to nurturing young minds with quality education and Islamic values.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Noor Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Noor Academy | Empowering Minds, Shaping Futures",
    description:
      "Premier K-12 educational institution dedicated to nurturing young minds with quality education and Islamic values.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only"
          >
            Skip to main content
          </a>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
