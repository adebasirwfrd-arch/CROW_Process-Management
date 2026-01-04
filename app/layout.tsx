import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { SettingsProvider } from "@/components/providers/settings-provider"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CROW Process Management",
  description: "ISO 9001:2015 Manufacturing Process Control System",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CROW Process",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`} suppressHydrationWarning>
        <QueryProvider>
          <SettingsProvider>
            {children}
            <Toaster richColors position="top-center" />
          </SettingsProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
