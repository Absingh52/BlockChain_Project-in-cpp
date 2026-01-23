'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatsStrip from '@/components/StatsStrip'
import BlocksTable from '@/components/BlocksTable'
import TransactionsTable from '@/components/TransactionsTable'

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
    { hash: '14203991', number: 14203991, timestamp: '12 secs ago', validator: 'Core_Node_01', txns: 154 },
    { hash: '14203990', number: 14203990, timestamp: '14 secs ago', validator: 'AntPool_V2', txns: 89 },
    { hash: '14203989', number: 14203989, timestamp: '16 secs ago', validator: 'Lido_Ops', txns: 201 },
    { hash: '14203988', number: 14203988, timestamp: '18 secs ago', validator: 'Coinbase_Cloud', txns: 112 },
    { hash: '14203987', number: 14203987, timestamp: '21 secs ago', validator: 'Binance_Staking', txns: 98 },
  ]

  const mockTransactions = [
    { hash: '0x7a8b...9c2d', from: '0x12...34', to: '0x56...78', value: '0.45 ETH', status: 'success', type: 'swap' },
    { hash: '0x3e4f...1a2b', from: '0x98...76', to: 'Contract', value: '0.00 ETH', status: 'success', type: 'call' },
    { hash: '0x9d8e...5f4g', from: '0xab...cd', to: '0xef...gh', value: '12.50 ETH', status: 'success', type: 'swap' },
    { hash: '0xc1b2...a3d4', from: '0x55...44', to: '0x11...22', value: '5,000 USDC', status: 'success', type: 'token' },
    { hash: '0xe6f5...d4c3', from: '0x88...99', to: '0x77...66', value: '1.02 ETH', status: 'success', type: 'swap' },
  ]

  /* ---------------- UI ---------------- */

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen bg-[#0b141a] pt-16">

        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center px-6 pt-32 pb-40 overflow-hidden "
          style={{
            background:
              'linear-gradient(180deg, #0f2a3d 0%, #101c22 55%, #0a1419 100%)',
          }}
        >
          {/* Background Orbs */}
          <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-primary/25 blur-3xl -z-20" />
          <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-blue-500/20 blur-3xl -z-20" />

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none -z-10 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Hero Content */}
          <div className="relative z-20 flex flex-col items-center max-w-4xl gap-8 text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c262c] border border-primary/30 text-xs font-medium text-primary"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-primary animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
              </span>
              Mainnet Beta Live
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-bold tracking-tight text-white"
              style={{
                fontSize: 'clamp(2.4rem, 8vw, 4.2rem)',
                textShadow: '0 0 40px rgba(19,164,236,0.35)',
              }}
            >
              The Ledger for the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-blue-400">
                Future
              </span>
              .
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="max-w-2xl text-lg md:text-xl text-slate-200"
            >
              High-performance exploration and non-custodial wallet solutions for the decentralized web.
              Experience sub-second finality.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col w-full gap-4 mt-6 mb-16 sm:flex-row sm:w-auto"
            >
              <Link
                href="/wallet"
                className="h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center shadow-[0_0_30px_rgba(19,164,236,0.6)]"
              >
                Create Wallet
              </Link>

              <Link
                href="/explorer"
                className="flex items-center justify-center h-12 px-8 font-bold text-white border-2 rounded-lg border-primary hover:bg-primary/10"
              >
                Explore Blocks
              </Link>
            </motion.div>
          </div>

          {/* ================= STATS STRIP ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-20 w-full mt-24"
          >
            <StatsStrip stats={stats} />
          </motion.div>
        </section>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-16 flex flex-col gap-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <BlocksTable blocks={mockBlocks} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <TransactionsTable transactions={mockTransactions} />
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
