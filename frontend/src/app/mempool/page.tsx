'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface MempoolTx {
  id: string
  hash: string
  from: string
  to: string
  value: string
  gasPrice: string
  status: 'pending' | 'confirmed'
  timestamp: string
}

export default function MempoolPage() {
  const [recipientAddr, setRecipientAddr] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedAsset, setSelectedAsset] = useState('ETH')
  const [gasLevel, setGasLevel] = useState('market')
  const [mempoolTxs, setMempoolTxs] = useState<MempoolTx[]>([])
  const feedRef = useRef<HTMLDivElement>(null)

  const assets = [
    { symbol: 'ETH', icon: 'payments', color: 'from-blue-500' },
    { symbol: 'USDC', icon: 'credit_card', color: 'from-green-500' },
    { symbol: 'DAI', icon: 'favorite', color: 'from-red-500' },
    { symbol: 'NEX', icon: 'star', color: 'from-purple-500' },
  ]

  const gasOptions = [
    { level: 'low', label: 'Low', gwei: '25', speed: '~30s' },
    { level: 'market', label: 'Market', gwei: '42', speed: '~10s' },
    { level: 'fast', label: 'Fast', gwei: '75', speed: '~5s' },
  ]

  const balance = 42.5042

  useEffect(() => {
    // Generate mock mempool transactions
    const mockTxs: MempoolTx[] = Array.from({ length: 50 }, (_, i) => {
      const status: 'pending' | 'confirmed' = Math.random() > 0.3 ? 'pending' : 'confirmed'
      return {
        id: `tx-${i}`,
        hash: `0x${Math.random().toString(16).slice(2, 18)}`,
        from: `0x${Math.random().toString(16).slice(2, 10)}...`,
        to: `0x${Math.random().toString(16).slice(2, 10)}...`,
        value: `${(Math.random() * 10).toFixed(2)} ETH`,
        gasPrice: `${Math.floor(Math.random() * 100) + 20} Gwei`,
        status,
        timestamp: `${Math.floor(Math.random() * 30)}s ago`,
      }
    })
    setMempoolTxs(mockTxs)
  }, [])

  useEffect(() => {
    // Auto-scroll mempool feed
    if (feedRef.current) {
      const interval = setInterval(() => {
        if (feedRef.current) {
          feedRef.current.scrollTop += 40
        }
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#111618]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm mb-8"
          >
            <span className="text-text-muted hover:text-white transition-colors cursor-pointer">Dashboard</span>
            <span className="text-[#556976]">/</span>
            <span className="text-white font-medium">Transaction Composer</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Transaction Composer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">send</span>
                    Send Transaction
                  </h2>
                  <p className="text-text-muted text-sm">Compose and broadcast transactions</p>
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Recipient Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={recipientAddr}
                      onChange={(e) => setRecipientAddr(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-3 rounded-lg bg-[#1a202c] border border-border-dark text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Amount</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-4 py-3 rounded-lg bg-[#1a202c] border border-border-dark text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                    <button className="px-3 py-3 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors font-bold text-sm">
                      MAX
                    </button>
                  </div>
                </div>

                {/* Asset Selector */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Select Asset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {assets.map((asset) => (
                      <button
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset.symbol)}
                        className={`p-3 rounded-lg border transition-all flex items-center gap-2 font-medium text-sm ${
                          selectedAsset === asset.symbol
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-[#1a202c] border-border-dark text-text-muted hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{asset.icon}</span>
                        {asset.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Balance Display */}
                <div className="bg-[#1a202c] border border-border-dark rounded-lg p-4">
                  <p className="text-xs text-text-muted mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-white font-mono">{balance} {selectedAsset}</p>
                </div>

                {/* Gas Selector */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Gas Level</label>
                  <div className="space-y-2">
                    {gasOptions.map((option) => (
                      <button
                        key={option.level}
                        onClick={() => setGasLevel(option.level)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          gasLevel === option.level
                            ? 'bg-primary/20 border-primary'
                            : 'bg-[#1a202c] border-border-dark hover:border-border-dark/80'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-semibold text-sm ${gasLevel === option.level ? 'text-primary' : 'text-white'}`}>
                              {option.label}
                            </p>
                            <p className="text-xs text-text-muted">{option.gwei} Gwei • {option.speed}</p>
                          </div>
                          {gasLevel === option.level && (
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#1a202c] border border-border-dark rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Transaction Fee:</span>
                    <span className="text-white font-mono">0.0042 ETH</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border-dark">
                    <span className="text-text-muted">Total:</span>
                    <span className="text-primary font-mono font-bold">{amount || '0'} ETH + fee</span>
                  </div>
                </div>

                {/* Sign & Broadcast */}
                <button className="w-full py-3 rounded-lg bg-primary hover:bg-sky-400 transition-colors text-white font-bold shadow-glow flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Sign & Broadcast
                </button>
              </div>
            </motion.div>

            {/* Right Panel: Live Mempool Feed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">memory</span>
                  Live Mempool Feed
                </h2>
                <p className="text-text-muted text-sm mb-4">
                  Pending transactions ({mempoolTxs.length})
                  <span className="relative inline-flex ml-2 h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                </p>

                {/* Mempool Table */}
                <div
                  ref={feedRef}
                  className="flex-1 overflow-y-auto space-y-2 custom-scrollbar"
                >
                  {mempoolTxs.map((tx, idx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="p-3 rounded-lg bg-[#1a202c] border border-border-dark hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white font-mono font-bold text-xs group-hover:text-primary transition-colors">
                            {tx.hash}
                          </p>
                          <p className="text-text-muted text-xs mt-1">
                            {tx.from} → {tx.to}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            tx.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-text-muted">
                        <span>{tx.value}</span>
                        <span>{tx.gasPrice}</span>
                        <span>{tx.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
