'use client'
import React from 'react'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const mockTransactions: TransactionDetail[] = Array.from({ length: 248 }, (_, i) => ({
    hash: `0x${Math.random().toString(16).slice(2, 18)}`,
    from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    value: `${(Math.random() * 50).toFixed(2)} ETH`,
    status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
    type: ['swap', 'transfer', 'call', 'token'][Math.floor(Math.random() * 4)] as any,
    timestamp: `${Math.floor(Math.random() * 60)} secs ago`,
    gasUsed: `${Math.floor(Math.random() * 200000)} gas`,
    gasPrice: `${(Math.random() * 100).toFixed(1)} Gwei`,
    nonce: Math.floor(Math.random() * 10000).toString(),
    blockNumber: 14203991 - i,
  }))

  // Filter logic
  const filteredTxs = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
    const matchesType = typeFilter === 'all' || tx.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const paginatedTxs = filteredTxs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage)

  const toggleRowExpand = (hash: string) => {
    setExpandedRows((prev) =>
      prev.includes(hash) ? prev.filter((x) => x !== hash) : [...prev, hash]
    )
  }

  const typeIcons: Record<string, string> = {
    swap: 'swap_horiz',
    transfer: 'send',
    call: 'article',
    token: 'token',
  }

  const statusConfig = {
    success: { color: 'text-green-400', bg: 'bg-green-400/10', icon: 'check_circle' },
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: 'schedule' },
    failed: { color: 'text-red-400', bg: 'bg-red-400/10', icon: 'cancel' },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-dark pt-[60px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 text-sm text-gray-500"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-medium text-white">Transactions</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="text-3xl font-black text-white">Transaction History</h1>
            <button className="px-4 py-2 text-sm text-white rounded bg-[#1c262d] border border-[#2a373f] hover:bg-[#2a373f] transition">
              Export CSV
            </button>
          </motion.div>

          {/* Transaction Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#162026] border border-[#2a373f] rounded-xl overflow-hidden shadow-lg"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a373f] bg-[#11191f]">
                    <th className="px-4 py-3"></th>
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
                  {paginatedTxs.map((tx, idx) => {
                    const isExpanded = expandedRows.includes(tx.hash)
                    const statusCfg = statusConfig[tx.status]

                    return (
                      <React.Fragment key={tx.hash}>
                        <motion.tr
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, delay: idx * 0.02 }}
                          className="border-b border-[#2a373f] hover:bg-[#1c262d] transition"
                        >
                          <td className="px-4 py-3">
                            <button onClick={() => toggleRowExpand(tx.hash)}>
                              <span className="material-symbols-outlined text-primary">
                                {isExpanded ? 'expand_less' : 'expand_more'}
                              </span>
                            </button>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {statusCfg.icon}
                              </span>
                              {tx.status}
                            </span>
                          </td>

                          <td className="flex items-center gap-2 px-4 py-3">
                            <span className="material-symbols-outlined text-[16px] text-slate-400">
                              {typeIcons[tx.type]}
                            </span>
                            <span className="text-white capitalize">{tx.type}</span>
                          </td>

                          <td className="px-4 py-3 font-mono text-xs text-primary">
                            {tx.hash}
                          </td>

                          <td className="px-4 py-3 font-mono text-xs text-slate-300">{tx.from}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-300">{tx.to}</td>
                          <td className="px-4 py-3 font-mono text-right text-white">{tx.value}</td>
                          <td className="px-4 py-3 text-xs text-right text-slate-400">{tx.timestamp}</td>
                        </motion.tr>

                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#1c262d] border-b border-[#2a373f]"
                          >
                            <td colSpan={8} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div>
                                  <p className="text-xs text-gray-500">Gas Used</p>
                                  <p className="font-mono text-sm text-white">{tx.gasUsed}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Gas Price</p>
                                  <p className="font-mono text-sm text-white">{tx.gasPrice}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Nonce</p>
                                  <p className="font-mono text-sm text-white">{tx.nonce}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Block Number</p>
                                  <p className="font-mono text-sm cursor-pointer text-primary hover:underline">
                                    #{tx.blockNumber.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
            <span>
              Showing {filteredTxs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredTxs.length)} of{' '}
              {filteredTxs.length} transactions
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-[#1c262d] border border-[#2a373f] rounded disabled:opacity-40"
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-[#1c262d] border border-[#2a373f] rounded disabled:opacity-40"
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
