import type { FixedDeposit } from "@/types/fixed-deposit"

// Mock API functions for fixed deposits
// In a real app, these would make actual API calls to your backend

interface CreateFixedDepositParams {
  amount: number
  duration: number
  interestRate: number
  walletAddress: string
}

// Mock database
let mockDeposits: FixedDeposit[] = []

export async function fetchFixedDeposits(userId: string): Promise<FixedDeposit[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Return mock data if no deposits exist yet
  if (mockDeposits.length === 0) {
    const now = new Date()

    // Create some sample deposits
    mockDeposits = [
      {
        id: "fd_1",
        userId,
        amount: 2.5,
        duration: 3,
        interestRate: 6,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        maturityDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        accruedInterest: 0.025,
        status: "active",
      },
      {
        id: "fd_2",
        userId,
        amount: 1.0,
        duration: 1,
        interestRate: 5,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        maturityDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago (matured)
        accruedInterest: 0.0042,
        status: "matured",
      },
    ]
  }

  return mockDeposits.filter((deposit) => deposit.userId === userId)
}

export async function createFixedDeposit(params: CreateFixedDepositParams): Promise<FixedDeposit> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const now = new Date()
  const maturityDate = new Date(now)
  maturityDate.setMonth(maturityDate.getMonth() + params.duration)

  const newDeposit: FixedDeposit = {
    id: `fd_${Date.now()}`,
    userId: "current_user", // In a real app, this would be the actual user ID
    amount: params.amount,
    duration: params.duration,
    interestRate: params.interestRate,
    walletAddress: params.walletAddress,
    createdAt: now.toISOString(),
    maturityDate: maturityDate.toISOString(),
    accruedInterest: 0,
    status: "active",
  }

  mockDeposits.push(newDeposit)

  return newDeposit
}

export async function withdrawFixedDeposit(depositId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // In a real app, this would call your smart contract to process the withdrawal
  mockDeposits = mockDeposits.filter((deposit) => deposit.id !== depositId)
}

export async function withdrawEarly(depositId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // In a real app, this would call your smart contract to process the early withdrawal
  mockDeposits = mockDeposits.filter((deposit) => deposit.id !== depositId)
}

// Mock function to get crypto to INR conversion rate
export async function getCryptoToInrRate(crypto = "ETH"): Promise<number> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock rates
  const rates: Record<string, number> = {
    ETH: 250000,
    BTC: 5000000,
    USDT: 83,
  }

  return rates[crypto] || 0
}
