'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface MiningLog {
  id: string
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
  timestamp: string
}

export default function MiningPage() {
  const [walletAddr, setWalletAddr] = useState('')
  const [workerName, setWorkerName] = useState('')
  const [isMining, setIsMining] = useState(false)
  const [logs, setLogs] = useState<MiningLog[]>([])
  const [hashrate, setHashrate] = useState(0)
  const [difficulty, setDifficulty] = useState(0)
  const [blocksFound, setBlocksFound] = useState(0)

  const logsEndRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)

  // Auto-scroll logic
  const [autoScroll, setAutoScroll] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const handleScroll = () => {
    if (!terminalRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = terminalRef.current
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10
    setAutoScroll(atBottom)
  }

  useEffect(() => {
    setHasLoaded(true)
  }, [])

  // Ring animation
  useEffect(() => {
    if (ringRef.current && isMining) {
      gsap.to(ringRef.current, {
        strokeDashoffset: -376.99,
        duration: 20,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          setHashrate(Math.floor(Math.random() * 500) + 100)
        },
      })
    }
    return () => {
      if (ringRef.current) gsap.killTweensOf(ringRef.current)
    }
  }, [isMining])

  // Auto scroll terminal
  useEffect(() => {
    if (!hasLoaded) return
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [logs, autoScroll, hasLoaded])

  // Mining simulation
  useEffect(() => {
    if (!isMining) return

    const miningInterval = setInterval(() => {
      const logMessages = [
        { level: 'info', message: 'Starting nonce iteration...' },
        { level: 'info', message: 'Testing nonce: 245892 (248.3 MH/s)' },
        { level: 'info', message: 'Testing nonce: 245893 (250.1 MH/s)' },
        { level: 'warning', message: 'Difficulty adjustment detected' },
        { level: 'success', message: '✓ Valid block found! Hash: 0x000abc... (Block #14204891)' },
      ]

      const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)]

      setLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          level: randomLog.level as any,
          message: randomLog.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])

      if (randomLog.level === 'success') setBlocksFound((prev) => prev + 1)

      setDifficulty(Math.floor(Math.random() * 50) + 25)
    }, 1500)

    return () => clearInterval(miningInterval)
  }, [isMining])

  // Start/Stop mining
  const toggleMining = () => {
    const next = !isMining
    setIsMining(next)

    if (next) {
      setAutoScroll(true)
      setLogs([
        {
          id: 'start-log',
          level: 'info',
          message: `Mining started with wallet ${walletAddr || '0x...'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }

  const getLogColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[100vh] bg-background-dark pt-[60px]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="flex items-center gap-3 mb-2 text-4xl font-bold text-white">
              <span className="text-4xl material-symbols-outlined text-primary">pick</span>
              Mining Console
            </h1>
            <p className="text-slate-400">Monitor and manage your mining operations</p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1c262b] border border-[#283339] rounded-xl p-6 mb-8 flex flex-col lg:flex-row gap-4 items-end"
          >
            <div className="flex-1 min-w-0">
              <label className="block mb-2 text-sm font-semibold text-white">Wallet Address</label>
              <input
                type="text"
                value={walletAddr}
                onChange={(e) => setWalletAddr(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f42bB2"
                disabled={isMining}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111618] border border-[#283339] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 font-mono text-sm"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block mb-2 text-sm font-semibold text-white">Worker Name</label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="worker-01"
                disabled={isMining}
                className="w-full px-4 py-2.5 rounded-lg bg-[#111618] border border-[#283339] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
            </div>

            <button
              onClick={toggleMining}
              className={`px-6 py-2.5 rounded-lg font-bold text-white transition-all flex items-center gap-2 whitespace-nowrap ${
                isMining
                  ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                  : 'bg-primary hover:bg-sky-400 shadow-[0_0_20px_rgba(19,164,236,0.4)]'
              }`}
            >
              <span className="material-symbols-outlined">
                {isMining ? 'stop_circle' : 'play_circle'}
              </span>
              {isMining ? 'Stop Mining' : 'Start Mining'}
            </button>
          </motion.div>

          {/* Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 min-h-[450px]">

            {/* Left Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1c262b] border border-[#283339] rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]"
            >
              <h3 className="mb-6 text-lg font-bold text-white">Nonce Probability</h3>
              
              <div className="relative w-40 h-40 mb-8">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(19,164,236,0.2)" strokeWidth="2" />
                  <circle ref={ringRef} cx="60" cy="60" r="50" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray="376.99" strokeLinecap="round" />
                  <circle cx="60" cy="60" r="30" fill="rgba(19,164,236,0.1)" stroke="rgba(19,164,236,0.3)" strokeWidth="1" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#13a4ec" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-mono text-2xl font-bold text-primary">{hashrate}</p>
                  <p className="mt-1 text-xs text-slate-400">MH/s</p>
                </div>
              </div>
            </motion.div>

            {/* Middle */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
              <div className="bg-[#1c262b] border border-[#283339] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary"><span className="material-symbols-outlined">speed</span></div>
                  <span className="text-slate-400">Hashrate</span>
                </div>
                <p className="font-mono text-3xl font-bold text-white">{hashrate} MH/s</p>
                <p className="mt-2 text-xs text-slate-500">Current: +5.2% efficiency</p>
              </div>

              <div className="bg-[#1c262b] border border-[#283339] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 text-purple-400 rounded-lg bg-purple-500/20"><span className="material-symbols-outlined">trending_up</span></div>
                  <span className="text-slate-400">Network Difficulty</span>
                </div>
                <p className="font-mono text-3xl font-bold text-white">{difficulty} T</p>
                <p className="mt-2 text-xs text-slate-500">Adjusted: 2 hours ago</p>
              </div>

              <div className="p-6 border bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 text-green-400 rounded-lg bg-green-500/30"><span className="material-symbols-outlined">check_circle</span></div>
                  <span className="text-slate-400">Blocks Found</span>
                </div>
                <p className="font-mono text-3xl font-bold text-green-400">{blocksFound}</p>
                <p className="mt-2 text-xs text-green-400/70">Session reward: {(blocksFound * 6.25).toFixed(2)} BTC</p>
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#111618] border border-[#283339] rounded-xl p-4 flex flex-col">
              <h3 className="flex items-center gap-2 mb-3 text-sm font-bold text-white">
                <span className="material-symbols-outlined text-primary">terminal</span>
                Mining Terminal
              </h3>
              
              <div
                ref={terminalRef}
                onScroll={handleScroll}
                className="bg-black rounded-lg p-4 font-mono text-sm overflow-y-auto border border-[#283339]/50 h-[300px] md:h-[350px] lg:h-[400px]"
              >
                {logs.length === 0 ? (
                  <p className="text-slate-500">Ready to mine... Start mining to see logs</p>
                ) : (
                  logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xs mb-1 ${getLogColor(log.level)}`}
                    >
                      <span className="text-slate-600">[{log.timestamp}]</span> {log.message}
                    </motion.div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#1c262b] border border-[#283339] rounded-xl p-6">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">assessment</span>
              Session Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="mb-1 text-xs text-slate-400">Mining Time</p>
                <p className="text-xl font-bold text-white">
                  {isMining ? `${Math.floor(logs.length / 4)} min` : '0 min'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400">Total Hashes</p>
                <p className="font-mono text-xl font-bold text-white">
                  {Math.floor(hashrate * 1000 * Math.max(1, logs.length / 4)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400">Avg Pool Share</p>
                <p className="text-xl font-bold text-primary">2.4%</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400">Estimated Reward</p>
                <p className="font-mono text-xl font-bold text-white">
                  {(blocksFound * 6.25 * 45000).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    </>
  )
}
