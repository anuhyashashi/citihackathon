import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { WalletProvider } from "@/context/wallet-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Crypto FD - Fixed Deposit Platform",
  description: "A cryptocurrency fixed deposit platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <WalletProvider>
              {children}
              <Toaster />
            </WalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
