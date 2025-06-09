"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FixedDepositList } from "@/components/fixed-deposit-list"
import { CreateFixedDeposit } from "@/components/create-fixed-deposit"
import { WalletInfo } from "@/components/wallet-info"
import type { FixedDeposit } from "@/types/fixed-deposit"
import { fetchFixedDeposits } from "@/lib/api"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const { wallet, connectWallet } = useWallet()
  const router = useRouter()
  const [deposits, setDeposits] = useState<FixedDeposit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadDeposits = async () => {
      try {
        const data = await fetchFixedDeposits(user?.id || "")
        setDeposits(data)
      } catch (error) {
        console.error("Failed to fetch deposits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeposits()
  }, [isAuthenticated, router, user])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {!wallet ? <Button onClick={connectWallet}>Connect Wallet</Button> : <WalletInfo wallet={wallet} />}
          </div>

          <Tabs defaultValue="deposits" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="deposits">My Deposits</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>
            <TabsContent value="deposits" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Fixed Deposits</CardTitle>
                  <CardDescription>View and manage all your active fixed deposits</CardDescription>
                </CardHeader>
                <CardContent>
                  <FixedDepositList deposits={deposits} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="create" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Fixed Deposit</CardTitle>
                  <CardDescription>Create a new fixed deposit with your preferred terms</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateFixedDeposit
                    onSuccess={(newDeposit) => {
                      setDeposits([...deposits, newDeposit])
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
