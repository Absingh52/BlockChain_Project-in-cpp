'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface BlockTx {
  id: string
  hash: string
  from: string
  to: string
  value: string
  status: 'success' | 'pending' | 'failed'
}

export default function BlockDetailPage() {
  const params = useParams()
  const blockHash = params.hash as string
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const blockNumber = parseInt(blockHash) || 892103
  const itemsPerPage = 10

  const mockTransactions: BlockTx[] = Array.from({ length: 145 }, (_, i) => ({
    id: `${i + 1}`,
    hash: `0x${Math.random().toString(16).slice(2, 18)}`,
    from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    value: `${(Math.random() * 50).toFixed(2)} ETH`,
    status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
  }))

  const paginatedTxs = mockTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage)

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const blockDetails = [
    {
      icon: 'network_node',
      label: 'Difficulty',
      value: '56.23 T',
      color: 'from-blue-500',
    },
    {
      icon: 'person',
      label: 'Mined by',
      value: 'PoolBTC_v2',
      color: 'from-purple-500',
    },
    {
      icon: 'storage',
      label: 'Size',
      value: '1.34 MB',
      color: 'from-green-500',
    },
    {
      icon: 'card_giftcard',
      label: 'Block Reward',
      value: '6.25 BTC',
      color: 'from-orange-500',
    },
  ]

  const technicalDetails = [
    { label: 'Merkle Root', value: '3ba3edfd...', monospace: true },
    { label: 'Previous Hash', value: '00000000c937983...', monospace: true },
    { label: 'Nonce', value: '2436659948', monospace: true },
    { label: 'Version', value: '0x20000000', monospace: true },
    { label: 'Bits', value: '386c84bc', monospace: true },
    { label: 'Time', value: 'Oct 24, 2023 14:02:11 UTC', monospace: false },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-dark">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm mb-8"
          >
            <Link href="/" className="text-[#9db0b9] hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#556976]">/</span>
            <Link href="/explorer" className="text-[#9db0b9] hover:text-white transition-colors">
              Blocks
            </Link>
            <span className="text-[#556976]">/</span>
            <span className="text-white font-medium">#{blockNumber.toLocaleString()}</span>
          </motion.div>

          {/* Main Block Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c262d] to-[#141a1f] border border-[#283339] mb-8"
          >
            {/* Decorative Gradient Top Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#13a4ec] to-[#8b5cf6]" />
            {/* Glow Effects */}
            <div className="absolute -top-24 -right-24 size-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 -left-12 size-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative p-6 lg:p-8 flex flex-col md:flex-row justify-between gap-6 items-start md:items-end">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                    Finalized
                  </span>
                  <span className="text-[#9db0b9] text-sm">Oct 24, 2023 14:02:11 UTC</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Block <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#13a4ec] to-[#8b5cf6]">
                    #{blockNumber.toLocaleString()}
                  </span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[#9db0b9] text-sm md:text-base break-all font-mono bg-black/20 px-3 py-1.5 rounded border border-white/5 max-w-md">
                    000000000000000000058452b47477161b9708608823565251662c19a8a8f2
                  </p>
                  <button className="p-1.5 text-[#9db0b9] hover:text-primary transition-colors" title="Copy Hash">
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-3">
                <button className="group flex items-center justify-center size-9 rounded-lg bg-[#1e2930] hover:bg-[#283339] border border-[#283339] transition-all">
                  <span className="material-symbols-outlined text-[#9db0b9] group-hover:text-white text-[20px]">
                    chevron_left
                  </span>
                </button>
                <button className="group flex items-center justify-center size-9 rounded-lg bg-[#1e2930] hover:bg-[#283339] border border-[#283339] transition-all">
                  <span className="material-symbols-outlined text-[#9db0b9] group-hover:text-white text-[20px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Block Details Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {blockDetails.map((detail, idx) => (
              <div
                key={detail.label}
                className="bg-[#1c262d] border border-[#283339] rounded-xl p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-blue-500/10 rounded-lg text-primary`}>
                    <span className="material-symbols-outlined">{detail.icon}</span>
                  </div>
                  <span className="text-[#9db0b9] text-sm font-medium">{detail.label}</span>
                </div>
                <p className="text-white text-xl font-bold group-hover:text-primary transition-colors">
                  {detail.value}
                </p>
              </div>
            ))}
          </motion.section>

          {/* Technical Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1c262d] border border-[#283339] rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Technical Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technicalDetails.map((detail) => (
                <div key={detail.label}>
                  <label className="text-[#9db0b9] text-sm font-medium mb-2 block">{detail.label}</label>
                  <input
                    type="text"
                    readOnly
                    value={detail.value}
                    className={`w-full px-3 py-2 rounded-lg bg-black/20 border border-[#283339] text-white text-sm focus:outline-none focus:border-primary transition-colors ${
                      detail.monospace ? 'font-mono' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Transactions Table */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Transactions ({mockTransactions.length})
            </h2>

            <div className="bg-[#1c262d] border border-[#283339] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#283339] bg-[#141a1f]">
                      <th className="text-left px-4 py-3 font-semibold text-[#9db0b9] w-12">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#9db0b9]">Hash</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#9db0b9]">From</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#9db0b9]">To</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#9db0b9]">Value</th>
                      <th className="text-center px-4 py-3 font-semibold text-[#9db0b9]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTxs.map((tx) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-[#283339] hover:bg-[#232e36] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleRowExpand(tx.id)}
                            className="text-primary hover:text-white"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {expandedRows.includes(tx.id) ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-3 font-mono text-primary hover:underline cursor-pointer">{tx.hash}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{tx.from}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{tx.to}</td>
                        <td className="px-4 py-3 text-right font-mono text-white">{tx.value}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              tx.status === 'success'
                                ? 'bg-green-400/10 text-green-400'
                                : tx.status === 'pending'
                                  ? 'bg-yellow-500/10 text-yellow-400'
                                  : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-slate-400 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, mockTransactions.length)} of{' '}
                {mockTransactions.length} transactions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-[#1c262d] border border-[#283339] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#283339] transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (pageNum > totalPages) return null
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'bg-[#1c262d] border-[#283339] text-white hover:bg-[#283339]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-[#1c262d] border border-[#283339] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#283339] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        <Footer />
      </main>
    </>
  )
}
