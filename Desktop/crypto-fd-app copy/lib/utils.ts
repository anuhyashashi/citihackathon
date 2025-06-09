import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FixedDeposit } from "@/types/fixed-deposit"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculateMaturityAmount(deposit: FixedDeposit): number {
  const principal = deposit.amount
  const rate = deposit.interestRate / 100
  const timeInYears = deposit.duration / 12

  // Simple interest calculation: P(1 + rt)
  const maturityAmount = principal * (1 + rate * timeInYears)

  return Number.parseFloat(maturityAmount.toFixed(4))
}

export function calculateTimeRemaining(maturityDateString: string): string {
  const now = new Date()
  const maturityDate = new Date(maturityDateString)

  if (now >= maturityDate) {
    return "Matured"
  }

  const diffTime = Math.abs(maturityDate.getTime() - now.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 30) {
    const months = Math.floor(diffDays / 30)
    const days = diffDays % 30
    return `${months} month${months !== 1 ? "s" : ""} ${days} day${days !== 1 ? "s" : ""}`
  }

  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
}
