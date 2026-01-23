'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ================= TYPES ================= */

interface TransactionDetail {
  hash: string
  from: string
  to: string
  value: string
  status: 'success' | 'pending' | 'failed'
  type: 'swap' | 'transfer' | 'call' | 'token'
  timestamp: string
  gasUsed: string
  gasPrice: string
  nonce: string
  blockNumber: number
}

/* ========== STRICT UNION CONSTANTS ========= */

const STATUS_VALUES: TransactionDetail['status'][] = [
  'success',
  'pending',
  'failed',
]

const TYPE_VALUES: TransactionDetail['type'][] = [
  'swap',
  'transfer',
  'call',
  'token',
]

/* ================= PAGE ================= */

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionDetail['status']>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionDetail['type']>('all')
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 15

  /* ================= MOCK DATA ================= */

  const mockTransactions: TransactionDetail[] = Array.from({ length: 248 }, (_, i) => ({
    hash: `0x${Math.random().toString(16).slice(2, 18)}`,
    from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    value: `${(Math.random() * 50).toFixed(2)} ETH`,
    status: STATUS_VALUES[Math.floor(Math.random() * STATUS_VALUES.length)],
    type: TYPE_VALUES[Math.floor(Math.random() * TYPE_VALUES.length)],
    timestamp: `${Math.floor(Math.random() * 60)} secs ago`,
    gasUsed: `${Math.floor(Math.random() * 200000)} gas`,
    gasPrice: `${(Math.random() * 100).toFixed(1)} Gwei`,
    nonce: Math.floor(Math.random() * 10000).toString(),
    blockNumber: 14203991 - i,
  }))

  /* ================= FILTER LOGIC ================= */

  const filteredTxs = mockTransactions.filter((tx) => {
    const q = searchQuery.toLowerCase()

    const matchesSearch =
      tx.hash.toLowerCase().includes(q) ||
      tx.from.toLowerCase().includes(q) ||
      tx.to.toLowerCase().includes(q)

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
    const matchesType = typeFilter === 'all' || tx.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage)

  const paginatedTxs = filteredTxs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleRowExpand = (hash: string) => {
    setExpandedRows((prev) =>
      prev.includes(hash) ? prev.filter((x) => x !== hash) : [...prev, hash]
    )
  }

  /* ================= UI CONFIG ================= */

  const typeIcons: Record<TransactionDetail['type'], string> = {
    swap: 'swap_horiz',
    transfer: 'send',
    call: 'article',
    token: 'token',
  }

  const statusConfig: Record<
    TransactionDetail['status'],
    { color: string; bg: string; icon: string }
  > = {
    success: { color: 'text-green-400', bg: 'bg-green-400/10', icon: 'check_circle' },
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: 'schedule' },
    failed: { color: 'text-red-400', bg: 'bg-red-400/10', icon: 'cancel' },
  }

  /* ================= RENDER ================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-dark pt-[60px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <span className="font-medium text-white">Transactions</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-white">Transaction History</h1>
            <button className="px-4 py-2 text-sm text-white rounded bg-[#1c262d] border border-[#2a373f] hover:bg-[#2a373f] transition">
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#162026] border border-[#2a373f] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#11191f] border-b border-[#2a373f]">
                  <tr>
                    <th className="px-4 py-3" />
                    <th className="px-4 py-3 text-left text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left text-gray-400">Hash</th>
                    <th className="px-4 py-3 text-left text-gray-400">From</th>
                    <th className="px-4 py-3 text-left text-gray-400">To</th>
                    <th className="px-4 py-3 text-right text-gray-400">Value</th>
                    <th className="px-4 py-3 text-right text-gray-400">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTxs.map((tx) => {
                    const expanded = expandedRows.includes(tx.hash)
                    const cfg = statusConfig[tx.status]

                    return (
                      <React.Fragment key={tx.hash}>
                        <tr className="border-b border-[#2a373f] hover:bg-[#1c262d]">
                          <td className="px-4 py-3">
                            <button onClick={() => toggleRowExpand(tx.hash)}>
                              {expanded ? '−' : '+'}
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${cfg.bg} ${cfg.color}`}>
                              {tx.status}
                            </span>
                          </td>

                          <td className="flex items-center gap-2 px-4 py-3">
                            <span className="material-symbols-outlined text-slate-400">
                              {typeIcons[tx.type]}
                            </span>
                            <span className="text-white capitalize">{tx.type}</span>
                          </td>

                          <td className="px-4 py-3 font-mono text-primary">{tx.hash}</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{tx.from}</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{tx.to}</td>
                          <td className="px-4 py-3 font-mono text-right text-white">{tx.value}</td>
                          <td className="px-4 py-3 text-right text-slate-400">{tx.timestamp}</td>
                        </tr>

                        {expanded && (
                          <tr className="bg-[#1c262d]">
                            <td colSpan={8} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                <div>
                                  <p className="text-gray-500">Gas Used</p>
                                  <p className="text-white">{tx.gasUsed}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Gas Price</p>
                                  <p className="text-white">{tx.gasPrice}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Nonce</p>
                                  <p className="text-white">{tx.nonce}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Block</p>
                                  <p className="text-primary">#{tx.blockNumber}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} –{' '}
              {Math.min(currentPage * itemsPerPage, filteredTxs.length)} of{' '}
              {filteredTxs.length}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-[#1c262d] border rounded disabled:opacity-40"
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-[#1c262d] border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

        </div>

        <Footer />
      </main>
    </>
  )
}
