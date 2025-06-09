"use client"

import { Button } from "@/components/ui/button"
import type { Wallet } from "@/types/wallet"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletInfoProps {
  wallet: Wallet
}

export function WalletInfo({ wallet }: WalletInfoProps) {
  const { toast } = useToast()

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  // Format address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Connected Wallet</span>
        <div className="flex items-center gap-1">
          <span className="font-medium">{formatAddress(wallet.address)}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="border-l pl-3 ml-1">
        <span className="text-xs text-gray-500">Balance</span>
        <p className="font-medium">{wallet.balance} ETH</p>
        <p className="text-xs text-gray-500">≈ ₹{(wallet.balance * 250000).toLocaleString("en-IN")}</p>
      </div>
    </div>
  )
}
