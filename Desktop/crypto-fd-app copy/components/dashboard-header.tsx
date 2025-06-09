"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          Crypto FD
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
