"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { createFixedDeposit } from "@/lib/api"
import type { FixedDeposit } from "@/types/fixed-deposit"

interface CreateFixedDepositProps {
  onSuccess: (deposit: FixedDeposit) => void
}

export function CreateFixedDeposit({ onSuccess }: CreateFixedDepositProps) {
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("3")
  const [isLoading, setIsLoading] = useState(false)
  const { wallet } = useWallet()
  const { toast } = useToast()

  // Interest rates based on duration
  const interestRates: Record<string, number> = {
    "1": 5,
    "3": 6,
    "6": 7,
    "12": 8,
    "24": 9,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a fixed deposit.",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const deposit = await createFixedDeposit({
        amount: Number.parseFloat(amount),
        duration: Number.parseInt(duration),
        interestRate: interestRates[duration],
        walletAddress: wallet.address,
      })

      toast({
        title: "Fixed Deposit Created",
        description: `Your fixed deposit of ${amount} ETH has been created successfully.`,
      })

      onSuccess(deposit)
      setAmount("")
    } catch (error) {
      toast({
        title: "Failed to create deposit",
        description: "There was an error creating your fixed deposit.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Deposit Amount (ETH)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {amount && (
          <p className="text-sm text-gray-500">≈ ₹{(Number.parseFloat(amount) * 250000).toLocaleString("en-IN")} INR</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (Months)</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Month (5% APY)</SelectItem>
            <SelectItem value="3">3 Months (6% APY)</SelectItem>
            <SelectItem value="6">6 Months (7% APY)</SelectItem>
            <SelectItem value="12">12 Months (8% APY)</SelectItem>
            <SelectItem value="24">24 Months (9% APY)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Summary</h3>
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between">
            <span>Principal Amount:</span>
            <span>{amount ? `${amount} ETH` : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Interest Rate:</span>
            <span>{interestRates[duration]}% APY</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>
              {duration} {Number.parseInt(duration) === 1 ? "Month" : "Months"}
            </span>
          </div>
          <div className="flex justify-between font-medium border-t pt-2 mt-2">
            <span>Estimated Interest:</span>
            <span>
              {amount
                ? `${((Number.parseFloat(amount) * interestRates[duration] * Number.parseInt(duration)) / 1200).toFixed(4)} ETH`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>In INR:</span>
            <span>
              {amount
                ? `₹${((Number.parseFloat(amount) * interestRates[duration] * Number.parseInt(duration) * 250000) / 1200).toLocaleString("en-IN")}`
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !wallet}>
        {isLoading ? "Creating..." : "Create Fixed Deposit"}
      </Button>
    </form>
  )
}
