'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatsStrip from '@/components/StatsStrip'
import BlocksTable from '@/components/BlocksTable'
import TransactionsTable from '@/components/TransactionsTable'

/* ========== SHARED TYPES ========== */

type Block = {
  hash: string
  number: number
  timestamp: string
  validator: string
  txns: number
}

type Transaction = {
  hash: string
  from: string
  to: string
  value: string
  status: 'success' | 'pending' | 'failed'
  type: 'swap' | 'call' | 'token' | 'transfer'
  timestamp: string
  gasUsed: string
  gasPrice: string
  nonce: string
  blockNumber: number
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)

  /* ---------------- MOCK DATA (UI ONLY) ---------------- */

  const stats = [
    { label: 'Block Height', value: '14,203,991', trend: '●', trendColor: 'text-emerald-500' },
    { label: 'Avg Block Time', value: '2.1', unit: 's', trend: '-0.1s', trendColor: 'text-primary' },
    { label: 'TPS', value: '4,289', trend: '↑ 12%', trendColor: 'text-emerald-500' },
    { label: 'Active Nodes', value: '8,021', unit: 'Global' },
  ]

  const mockBlocks = [
    {
      hash: '14203991',
      number: 14203991,
      timestamp: '12 secs ago',
      validator: 'Core_Node_01',
      txns: 154,
    },
    {
      hash: '14203990',
      number: 14203990,
      timestamp: '14 secs ago',
      validator: 'AntPool_V2',
      txns: 89,
    },
    {
      hash: '14203989',
      number: 14203989,
      timestamp: '16 secs ago',
      validator: 'Lido_Ops',
      txns: 201,
    },
    {
      hash: '14203988',
      number: 14203988,
      timestamp: '18 secs ago',
      validator: 'Coinbase_Cloud',
      txns: 112,
    },
    {
      hash: '14203987',
      number: 14203987,
      timestamp: '21 secs ago',
      validator: 'Binance_Staking',
      txns: 98,
    },
  ] satisfies Block[]

  const mockTransactions = [
    {
      hash: '0x7a8b...9c2d',
      from: '0x12...34',
      to: '0x56...78',
      value: '0.45 ETH',
      status: 'success',
      type: 'swap',
      timestamp: '12 secs ago',
      gasUsed: '21000 gas',
      gasPrice: '30 Gwei',
      nonce: '12',
      blockNumber: 14203991,
    },
    {
      hash: '0x3e4f...1a2b',
      from: '0x98...76',
      to: 'Contract',
      value: '0.00 ETH',
      status: 'success',
      type: 'call',
      timestamp: '25 secs ago',
      gasUsed: '150000 gas',
      gasPrice: '28 Gwei',
      nonce: '75',
      blockNumber: 14203990,
    },
    {
      hash: '0x9d8e...5f4g',
      from: '0xab...cd',
      to: '0xef...gh',
      value: '12.50 ETH',
      status: 'success',
      type: 'swap',
      timestamp: '32 secs ago',
      gasUsed: '450000 gas',
      gasPrice: '35 Gwei',
      nonce: '320',
      blockNumber: 14203989,
    },
    {
      hash: '0xc1b2...a3d4',
      from: '0x55...44',
      to: '0x11...22',
      value: '5,000 USDC',
      status: 'success',
      type: 'token',
      timestamp: '45 secs ago',
      gasUsed: '90000 gas',
      gasPrice: '27 Gwei',
      nonce: '8',
      blockNumber: 14203988,
    },
    {
      hash: '0xe6f5...d4c3',
      from: '0x88...99',
      to: '0x77...66',
      value: '1.02 ETH',
      status: 'success',
      type: 'swap',
      timestamp: '1 min ago',
      gasUsed: '30000 gas',
      gasPrice: '29 Gwei',
      nonce: '103',
      blockNumber: 14203987,
    },
  ] satisfies Transaction[]

  /* ---------------- UI ---------------- */

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen bg-[#0b141a] pt-16">

        {/* HERO */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center px-6 pt-32 pb-40 overflow-hidden"
          style={{
            background:'linear-gradient(180deg, #0f2a3d 0%, #101c22 55%, #0a1419 100%)',
          }}
        >
          <div className="relative z-20 flex flex-col items-center max-w-4xl gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c262c] border border-primary/30 text-xs font-medium text-primary"
            >
              Mainnet Beta Live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-bold tracking-tight text-white"
              style={{ fontSize: 'clamp(2.4rem, 8vw, 4.2rem)' }}
            >
              The Ledger for the Future.
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-20 w-full mt-24"
          >
            <StatsStrip stats={stats} />
          </motion.div>
        </section>

        {/* MAIN CONTENT */}
        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-16 flex flex-col gap-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <BlocksTable blocks={mockBlocks} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <TransactionsTable transactions={mockTransactions} />
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
