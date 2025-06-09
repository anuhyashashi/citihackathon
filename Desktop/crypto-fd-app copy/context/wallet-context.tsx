"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Wallet } from "@/types/wallet"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  wallet: Wallet | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    const storedWallet = localStorage.getItem("wallet")
    if (storedWallet) {
      try {
        setWallet(JSON.parse(storedWallet))
      } catch (error) {
        console.error("Failed to restore wallet:", error)
      }
    }
  }, [])

  const connectWallet = async () => {
    // This is a mock implementation
    // In a real app, you would use a library like ethers.js or web3.js to connect to MetaMask
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Mock successful wallet connection
          const mockWallet: Wallet = {
            address:
              "0x" +
              Array(40)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join(""),
            balance: Number.parseFloat((Math.random() * 10).toFixed(4)),
            chainId: 1,
          }

          setWallet(mockWallet)
          localStorage.setItem("wallet", JSON.stringify(mockWallet))

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully.",
          })

          resolve()
        } catch (error) {
          toast({
            title: "Connection Failed",
            description: "Failed to connect wallet. Please try again.",
            variant: "destructive",
          })
          reject(error)
        }
      }, 1000)
    })
  }

  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("wallet")
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
