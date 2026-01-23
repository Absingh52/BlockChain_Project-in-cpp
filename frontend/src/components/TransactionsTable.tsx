'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { animations } from '@/lib/animations'

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  status: 'success' | 'pending' | 'failed'
  type: 'swap' | 'transfer' | 'call' | 'token'
}

interface TransactionsTableProps {
  transactions: Transaction[]
}

const statusConfig = {
  success: { color: 'text-[#13a4ec]', bg: 'bg-[#13a4ec]/10', border: 'border-[#13a4ec]/20' },
  pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
}

const typeIcons: Record<string, string> = {
  swap: 'swap_horiz',
  transfer: 'swap_horiz',
  call: 'article',
  token: 'token',
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#283339]">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="material-symbols-outlined text-primary">receipt_long</span>
          Latest Transactions
        </h3>
        <Link
          href="/transactions"
          className="px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors border rounded text-primary hover:text-white border-primary/30 hover:bg-primary/10"
        >
          View All
        </Link>
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-[#1c262c] border border-[#283339] rounded-lg overflow-hidden">
        <div className="divide-y divide-[#283339]">
          {transactions.map((tx, idx) => {
            const statusStyle = statusConfig[tx.status]
            return (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="p-4 flex items-center justify-between hover:bg-[#232e36] transition-colors"
              >
                <div className="flex items-center min-w-0 gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#283339] flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined">{typeIcons[tx.type]}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block font-mono text-sm truncate text-primary">
                      {tx.hash}
                    </span>
                    <span className="block text-xs truncate text-slate-500">
                      {tx.from} → {tx.to}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}
                  >
                    {tx.value}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {transactions.map((tx, idx) => {
          const statusStyle = statusConfig[tx.status]
          return (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#1c262c] border border-[#283339] rounded-lg p-4"
              onMouseEnter={(e) => animations.cardHoverGlow(e.currentTarget, '#13a4ec')}
              onMouseLeave={(e) => animations.cardHoverGlowOut(e.currentTarget)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-primary">{tx.hash}</span>
                <span className={`text-xs px-2 py-1 rounded ${statusStyle.bg} ${statusStyle.color}`}>
                  {tx.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                <div>From: {tx.from}</div>
                <div>To: {tx.to}</div>
                <div className="font-mono text-white">{tx.value}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
