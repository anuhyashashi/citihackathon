export interface FixedDeposit {
  id: string
  userId: string
  amount: number
  duration: number
  interestRate: number
  walletAddress: string
  createdAt: string
  maturityDate: string
  accruedInterest: number
  status: "active" | "matured" | "withdrawn"
}
