'use client'

import { motion } from 'framer-motion'

interface WalletCardProps {
  title: string
  amount: string
  currency: string
  usdValue?: string
  icon: string
  color?: string
}

export default function WalletCard({
  title,
  amount,
  currency,
  usdValue,
  icon,
  color = 'indigo',
}: WalletCardProps) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 rounded-xl bg-[#1c262d] border border-[#283339] p-6 flex flex-col justify-center hover:border-primary/50 transition-colors"
    >
      <div className={`flex items-center gap-3 mb-2 p-2 rounded-lg w-fit ${colorMap[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-slate-400 font-medium text-sm">{title}</span>
      <p className="text-2xl font-bold text-white mt-2">
        {amount} <span className="text-lg text-slate-400 font-normal">{currency}</span>
      </p>
      {usdValue && <p className="text-sm text-slate-500 mt-1">≈ {usdValue}</p>}
    </motion.div>
  )
}
