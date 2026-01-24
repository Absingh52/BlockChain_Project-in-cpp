'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { storage } from '@/utils/storage'

export default function SendPage() {
  const [senderAddress, setSenderAddress] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  useEffect(() => {
    const wallet = storage.getSessionWallet()
    if (wallet) {
      setSenderAddress(wallet.publicKey)
    } else {
      setSenderAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f42bB2')
    }
  }, [])

  const handleSendTransaction = async () => {
    if (!senderAddress || !receiverAddress || !amount) {
      setMessage('All fields required')
      setMessageType('error')
      return
    }

    if (Number(amount) <= 0) {
      setMessage('Amount must be greater than 0')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    // Simulate sending - UI example mode
    setTimeout(() => {
      setMessage('✓ Transaction sent successfully')
      setMessageType('success')
      setReceiverAddress('')
      setAmount('')
      setLoading(false)

      setTimeout(() => {
        setMessage('')
      }, 3000)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-dark pt-[60px]">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#283339] bg-[#101c22]/80 backdrop-blur-md px-6 py-4 rounded-xl mb-6">
            <h2 className="text-xl font-bold text-white">Send Transaction</h2>
            <div className="flex items-center gap-3 px-4 py-2 border rounded-full bg-blue-500/10 border-blue-500/20">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"></span>
              </span>
              <span className="text-xs font-medium text-blue-400">Demo Mode</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            
            {/* Send Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1c262d] border border-[#283339] rounded-xl p-8 space-y-6"
            >
              
              {/* From Address */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-white">From Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={senderAddress}
                    className="flex-1 px-4 py-3 rounded-lg bg-[#141a1f] border border-[#283339] text-primary font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(senderAddress)}
                    className="px-4 py-3 rounded-lg bg-[#283339] hover:bg-[#3b4b54] transition-colors text-white"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              </div>

              {/* To Address */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-white">To Address</label>
                <input
                  type="text"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f42bB2"
                  className="w-full px-4 py-3 rounded-lg bg-[#141a1f] border border-[#283339] text-white font-mono text-sm placeholder-slate-600 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-white">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-[#141a1f] border border-[#283339] text-white text-sm placeholder-slate-600 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-300">
                  <span className="font-semibold">ℹ️ Demo Mode:</span> This is a demonstration UI. Click Send to see the success message.
                </p>
              </div>

              {/* Send Button */}
              <motion.button
                onClick={handleSendTransaction}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 text-sm font-bold text-white rounded-lg bg-primary hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin">⏳</span>
                    Sending...
                  </span>
                ) : (
                  'Send Transaction'
                )}
              </motion.button>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 text-sm font-medium p-4 rounded-lg border ${
                    messageType === 'success'
                      ? 'bg-green-500/10 border-green-500/30 text-green-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {messageType === 'success' ? 'check_circle' : 'error'}
                  </span>
                  {message}
                </motion.div>
              )}

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
