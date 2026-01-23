'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TransactionsTable from '@/components/TransactionsTable'

interface Block {
  hash: string
  number: number
  timestamp: string
  validator: string
  txns: number
}

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  status: 'success' | 'pending' | 'failed'
  type: 'swap' | 'transfer' | 'call' | 'token'
}

export default function ExplorerPage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const mockBlocks: Block[] = Array.from({ length: 9 }, (_, i) => ({
      hash: `14203${(991 - i).toString().padStart(3, '0')}`,
      number: 14203991 - i,
      timestamp: `${i * 2 + 1} secs ago`,
      validator: [
        'Core_Node_01',
        'AntPool_V2',
        'Lido_Ops',
        'Coinbase_Cloud',
        'Binance_Staking',
      ][i % 5],
      txns: Math.floor(Math.random() * 300) + 50,
    }))
    setBlocks(mockBlocks)

    const mockTxs: Transaction[] = Array.from({ length: 12 }, () => ({
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
      from: `0x${Math.random().toString(16).slice(2, 6)}...`,
      to: `0x${Math.random().toString(16).slice(2, 6)}...`,
      value: `${(Math.random() * 5).toFixed(2)} ETH`,
      status: 'success',
      type: 'swap',
    }))
    setTransactions(mockTxs)
  }, [])

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen bg-[#0b141a] pt-16">
        <main className="relative z-10 px-6 py-8 max-w-[1600px] mx-auto">

          {/* METRICS */}
          <div className="grid grid-cols-1 gap-4 mb-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Network Hashrate', value: '425 TH/s' },
              { label: 'Gas Price', value: '42 Gwei' },
              { label: 'Avg Block Time', value: '12.5s' },
              { label: 'Coin Price', value: '$2,450.32' },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.04 }}
                className="rounded-xl bg-[#1E2A32] border border-[#2F3F47] p-6 shadow-lg"
              >
                <p className="text-sm font-medium text-slate-300">{m.label}</p>
                <p className="mt-1 text-3xl font-semibold text-white">{m.value}</p>
              </motion.div>
            ))}
          </div>

          {/* BLOCKS */}
          <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 lg:grid-cols-3">
            {blocks.map((block, i) => (
              <motion.div
                key={block.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-[#1c262c] border border-[#283339] rounded-lg p-4"
              >
                <Link href={`/block/${block.number}`}>
                  <p className="font-bold text-primary hover:underline">
                    Block #{block.number}
                  </p>
                </Link>

                <p className="mb-3 text-xs text-slate-400">{block.timestamp}</p>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transactions</span>
                    <span className="text-white">{block.txns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Validator</span>
                    <span className="truncate text-slate-300">{block.validator}</span>
                  </div>
                  <div className="pt-2 border-t border-[#283339] text-slate-400 truncate">
                    Hash: {block.hash}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* TRANSACTIONS */}
          {transactions.length > 0 && (
            <TransactionsTable transactions={transactions} />
          )}

        </main>
      </div>

      <Footer />
    </>
  )
}
