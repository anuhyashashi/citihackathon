import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crypto FD</h1>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Grow Your Crypto with Fixed Deposits</h2>
            <p className="text-xl mb-8 text-gray-600">
              Secure, transparent, and high-yield fixed deposits for your cryptocurrency assets.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Fixed Deposits</h3>
                <p className="text-gray-600">
                  Create fixed deposits with customizable duration and competitive interest rates.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Monitor your deposits and accrued interest in real-time with INR conversion.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Flexible Withdrawals</h3>
                <p className="text-gray-600">
                  Withdraw your funds after maturity or opt for early withdrawal with adjusted terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Crypto FD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
