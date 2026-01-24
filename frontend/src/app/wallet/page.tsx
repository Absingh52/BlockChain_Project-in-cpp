'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface WalletTransaction {
  id: string
  hash: string
  from: string
  to: string
  value: string
  status: 'success' | 'pending'
  timestamp: string
}

export default function WalletPage() {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [walletTxs, setWalletTxs] = useState<WalletTransaction[]>([])
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
    const mockTxs = Array.from({ length: 8 }, (_, i) => {
      const status: 'success' | 'pending' = Math.random() > 0.2 ? 'success' : 'pending'
      return {
        id: `tx-${i}`,
        hash: `0x${Math.random().toString(16).slice(2, 18)}`,
        from: i % 2 === 0 ? '0x1234...5678' : '0xabcd...ef01',
        to: i % 2 === 0 ? '0xabcd...ef01' : 'Contract',
        value: `${(Math.random() * 5).toFixed(2)} ETH`,
        status,
        timestamp: `${(i + 1) * 2} min ago`,
      }
    })
    setWalletTxs(mockTxs)
  }, [])

  const seedPhrase = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'abuse', 'access', 'accident', 'account']
  const publicAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f42bB2'
  const privateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-dark pt-[60px]">
        
        {/* Full Width Container */}
        <div className="max-w-[1600px] mx-auto px-6 py-6">

          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#283339] bg-[#101c22]/80 backdrop-blur-md px-6 py-4 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-white">Wallet Management</h2>
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

            {/* Hero Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c262d] to-[#141a1f] border border-primary/20 p-8 shadow-lg"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative">
                <p className="mb-2 text-sm text-slate-400">Total Asset Value</p>
                <h1 className="mb-6 text-5xl font-bold text-white">$12,450.32</h1>
                <div className="flex gap-4">
                  <Link href="/send">
                    <button className="px-6 py-2 text-sm font-bold text-white transition-colors rounded-lg bg-primary hover:bg-sky-400">
                      Send
                    </button>
                  </Link>
                  <Link href="/receive">
                    <button className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-[#283339] hover:bg-[#3b4b54] transition-colors">
                      Receive
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Mini Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-[#1c262d] border border-[#283339] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-400">Bitcoin Holdings</span>
                  <span className="text-orange-500 material-symbols-outlined">trending_up</span>
                </div>
                <p className="text-2xl font-bold text-white">0.5234 BTC</p>
                <p className="mt-2 text-xs text-slate-500">≈ $21,324.12</p>
              </div>

              <div className="bg-[#1c262d] border border-[#283339] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-400">Ethereum Holdings</span>
                  <span className="text-blue-500 material-symbols-outlined">trending_up</span>
                </div>
                <p className="text-2xl font-bold text-white">5.4231 ETH</p>
                <p className="mt-2 text-xs text-slate-500">≈ $8,832.45</p>
              </div>
            </div>

            {/* Key Management */}
            <div className="bg-[#1c262d] border border-[#283339] rounded-xl p-6 space-y-6">

              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">vpn_key</span>
                <h3 className="text-xl font-bold text-white">Key Management</h3>
              </div>

              {/* Public Address */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-white">Public Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicAddress}
                    className="flex-1 px-4 py-3 rounded-lg bg-[#141a1f] border border-[#283339] text-primary font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(publicAddress)}
                    className="px-4 py-3 rounded-lg bg-[#283339] hover:bg-[#3b4b54] transition-colors text-white"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              </div>

              {/* QR Loader */}
              <div className="flex items-center justify-center">
                <div
                  ref={loaderRef}
                  className="flex items-center justify-center w-32 h-32 mb-6 border rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/30"
                >
                  <span className="text-4xl material-symbols-outlined text-primary">qr_code_2</span>
                </div>
              </div>

              {/* Private Key */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-white">Private Key</label>
                <div className="flex gap-2">
                  <input
                    type={showPrivateKey ? 'text' : 'password'}
                    readOnly
                    value={privateKey}
                    className="flex-1 px-4 py-3 rounded-lg bg-[#141a1f] border border-[#283339] text-white font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="px-4 py-3 rounded-lg bg-[#283339] hover:bg-[#3b4b54] text-white"
                  >
                    <span className="material-symbols-outlined">
                      {showPrivateKey ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-red-400">⚠️ Never share your private key</p>
              </div>
            </div>

            {/* Seed Phrase */}
            <div className="bg-[#1c262d] border border-[#283339] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">lock</span>
                <h3 className="text-xl font-bold text-white">Seed Phrase (12 Words)</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                {seedPhrase.map((word, idx) => (
                  <div key={idx} className="bg-[#141a1f] border border-[#283339] rounded-lg p-3 text-center">
                    <p className="mb-1 text-xs text-slate-500">{idx + 1}</p>
                    <p className="font-mono text-sm font-bold text-white">{word}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#1c262d] border border-[#283339] rounded-xl p-6">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Recent Transactions
              </h3>
              <div className="space-y-3">
                {walletTxs.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#141a1f] border border-[#283339] hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm font-bold text-white">{tx.hash}</p>
                      <p className="text-xs text-slate-500">{tx.from} → {tx.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-white">{tx.value}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        tx.status === 'success'
                          ? 'text-green-400 bg-green-400/10'
                          : 'text-yellow-400 bg-yellow-400/10'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
