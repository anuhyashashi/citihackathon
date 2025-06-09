"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { FixedDeposit } from "@/types/fixed-deposit"
import { formatDate, calculateMaturityAmount, calculateTimeRemaining } from "@/lib/utils"
import { withdrawFixedDeposit, withdrawEarly } from "@/lib/api"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FixedDepositListProps {
  deposits: FixedDeposit[]
  isLoading: boolean
}

export function FixedDepositList({ deposits, isLoading }: FixedDepositListProps) {
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const [showEarlyWithdrawalDialog, setShowEarlyWithdrawalDialog] = useState(false)
  const [selectedDeposit, setSelectedDeposit] = useState<FixedDeposit | null>(null)
  const { toast } = useToast()

  const handleWithdraw = async (deposit: FixedDeposit) => {
    const now = new Date()
    const maturityDate = new Date(deposit.maturityDate)

    if (now < maturityDate) {
      setSelectedDeposit(deposit)
      setShowEarlyWithdrawalDialog(true)
      return
    }

    setWithdrawingId(deposit.id)

    try {
      await withdrawFixedDeposit(deposit.id)
      toast({
        title: "Withdrawal Successful",
        description: `Your deposit of ${deposit.amount} ETH and interest has been withdrawn.`,
      })
      // You would typically refresh the deposits list here
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal.",
        variant: "destructive",
      })
    } finally {
      setWithdrawingId(null)
    }
  }

  const handleEarlyWithdrawal = async () => {
    if (!selectedDeposit) return

    setWithdrawingId(selectedDeposit.id)
    setShowEarlyWithdrawalDialog(false)

    try {
      await withdrawEarly(selectedDeposit.id)
      toast({
        title: "Early Withdrawal Processed",
        description: "Your deposit has been withdrawn with reduced interest.",
      })
      // You would typically refresh the deposits list here
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your early withdrawal.",
        variant: "destructive",
      })
    } finally {
      setWithdrawingId(null)
      setSelectedDeposit(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Loading your deposits...</p>
      </div>
    )
  }

  if (deposits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don&apos;t have any fixed deposits yet.</p>
        <p className="mt-2">Create your first deposit to start earning interest.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {deposits.map((deposit) => {
        const isMatured = new Date() >= new Date(deposit.maturityDate)
        const timeRemaining = calculateTimeRemaining(deposit.maturityDate)
        const maturityAmount = calculateMaturityAmount(deposit)

        return (
          <Card key={deposit.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium">Deposit Details</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Principal:</span>
                      <span>{deposit.amount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Interest Rate:</span>
                      <span>{deposit.interestRate}% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{deposit.duration} Months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span>{formatDate(deposit.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Maturity Information</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Maturity Date:</span>
                      <span>{formatDate(deposit.maturityDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={isMatured ? "text-green-600" : "text-amber-600"}>
                        {isMatured ? "Matured" : "Active"}
                      </span>
                    </div>
                    {!isMatured && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time Remaining:</span>
                        <span>{timeRemaining}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-500">Maturity Amount:</span>
                      <span>{maturityAmount} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">In INR:</span>
                      <span>₹{(maturityAmount * 250000).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-4">
              <Button
                className="ml-auto"
                onClick={() => handleWithdraw(deposit)}
                disabled={withdrawingId === deposit.id}
              >
                {withdrawingId === deposit.id ? "Processing..." : isMatured ? "Withdraw" : "Withdraw Early"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}

      <AlertDialog open={showEarlyWithdrawalDialog} onOpenChange={setShowEarlyWithdrawalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Early Withdrawal Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              You are withdrawing before the maturity date. This will result in a reduced interest rate of 2% instead of{" "}
              {selectedDeposit?.interestRate}%.
              <div className="mt-4 bg-gray-100 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Original Maturity Amount:</span>
                  <span>{selectedDeposit ? calculateMaturityAmount(selectedDeposit) : 0} ETH</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Early Withdrawal Amount:</span>
                  <span>
                    {selectedDeposit
                      ? (selectedDeposit.amount * (1 + (0.02 * selectedDeposit.duration) / 12)).toFixed(4)
                      : 0}{" "}
                    ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1 text-red-600">
                  <span>Penalty:</span>
                  <span>
                    {selectedDeposit
                      ? (
                          calculateMaturityAmount(selectedDeposit) -
                          selectedDeposit.amount * (1 + (0.02 * selectedDeposit.duration) / 12)
                        ).toFixed(4)
                      : 0}{" "}
                    ETH
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEarlyWithdrawal}>Confirm Withdrawal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
