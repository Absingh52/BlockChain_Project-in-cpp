'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { animations } from '@/lib/animations'

interface Block {
  hash: string
  number: number
  timestamp: string
  validator: string
  txns: number
}

interface BlocksTableProps {
  blocks: Block[]
}

export default function BlocksTable({ blocks }: BlocksTableProps) {
  const handleCardHover = (element: HTMLElement) => {
    if (element) {
      animations.cardHoverGlow(element, '#13a4ec')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#283339]">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">view_in_ar</span>
          <span className="hidden sm:inline">Latest Blocks</span>
          <span className="sm:hidden">Blocks</span>
        </h3>
        <Link href="/explorer" className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-wider border border-primary/30 rounded px-2 sm:px-3 py-1 hover:bg-primary/10">
          All
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#1c262c] border border-[#283339] rounded-lg overflow-hidden">
        <div className="divide-y divide-[#283339]">
          {blocks.map((block, idx) => (
            <motion.div
              key={block.hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 hover:bg-[#232e36] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-10 w-10 rounded flex-shrink-0 bg-[#283339] flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">deployed_code</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <Link href={`/block/${block.number}`} className="text-primary font-mono font-medium text-sm hover:underline cursor-pointer truncate">
                    {block.number}
                  </Link>
                  <span className="text-slate-500 text-xs">{block.timestamp}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="text-white text-sm font-mono">
                  <span className="text-slate-400">Val:</span> <span className="text-primary hover:underline cursor-pointer">{block.validator}</span>
                </div>
                <span className="text-slate-500 text-xs">{block.txns} txns</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden grid gap-3 sm:gap-4">
        {blocks.map((block, idx) => (
          <motion.div
            key={block.hash}
            ref={(el) => {
              if (el) handleCardHover(el)
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#1c262c] border border-[#283339] rounded-lg p-4 hover:border-primary/30 transition-all cursor-pointer"
            onMouseEnter={(e) => animations.cardLift(e.currentTarget as HTMLElement)}
          >
            <Link href={`/block/${block.number}`} className="text-primary font-mono font-medium text-base hover:underline cursor-pointer block mb-2">
              Block #{block.number}
            </Link>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Time:</span>
                <span>{block.timestamp}</span>
              </div>
              <div className="flex justify-between text-slate-300 truncate">
                <span className="text-slate-500 flex-shrink-0">Validator:</span>
                <span className="text-primary hover:underline cursor-pointer truncate ml-2">{block.validator}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Txns:</span>
                <span className="font-mono">{block.txns}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
