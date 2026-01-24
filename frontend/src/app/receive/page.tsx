'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { storage } from '@/utils/storage'

export default function ReceivePage() {
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        rotation: 360,
        duration: 3,
        repeat: -1,
        ease: 'none',
      })
    }
  }, [])

  useEffect(() => {
    const wallet = storage.getSessionWallet()
    if (wallet) {
      setWalletAddress(wallet.publicKey)
    } else {
      setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f42bB2')
    }
  }, [])

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-dark pt-[60px]">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#283339] bg-[#101c22]/80 backdrop-blur-md px-6 py-4 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-white">Receive Transaction</h2>
            <div className="flex items-center gap-3 px-4 py-2 border rounded-full bg-green-500/10 border-green-500/20">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
              </span>
              <span className="text-xs font-medium text-green-400">Mainnet</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            
            {/* Receive Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1c262d] border border-[#283339] rounded-xl p-8 space-y-6"
            >
              
              {/* QR Code */}
              <div className="flex items-center justify-center">
                <div
                  ref={loaderRef}
                  className="flex items-center justify-center w-40 h-40 border rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/30"
                >
                  <span className="text-6xl material-symbols-outlined text-primary">qr_code_2</span>
                </div>
              </div>

              {/* Address Display */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-white">Your Wallet Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={walletAddress}
                    className="flex-1 px-4 py-3 rounded-lg bg-[#141a1f] border border-[#283339] text-primary font-mono text-sm"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyAddress}
                    className="px-4 py-3 rounded-lg bg-primary hover:bg-sky-400 transition-colors text-white"
                  >
                    <span className="material-symbols-outlined">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </motion.button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs text-green-400"
                  >
                    ✓ Address copied to clipboard
                  </motion.p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-xs text-green-300">
                  <span className="font-semibold">ℹ️ Share Your Address:</span> Others can send funds to this address. You can also share the QR code above.
                </p>
              </div>

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-xs text-yellow-300">
                  <span className="font-semibold">⚠️ Note:</span> Only share your public address. Never share your private key or seed phrase.
                </p>
              </div>

            </motion.div>

            {/* Back Button */}
            <Link href="/wallet">
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Wallet
              </button>
            </Link>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
