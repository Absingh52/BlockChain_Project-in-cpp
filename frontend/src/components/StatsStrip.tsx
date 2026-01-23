'use client'

import { motion } from 'framer-motion'

interface StatItem {
  label: string
  value: string
  unit?: string
  trend?: string
  trendColor?: string
}

interface StatsStripProps {
  stats: StatItem[]
  animated?: boolean
}

export default function StatsStrip({ stats, animated = true }: StatsStripProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const Component = animated ? motion.div : 'div'
  const ItemComponent = animated ? motion.div : 'div'

  return (
    <Component
      variants={animated ? containerVariants : {}}
      initial={animated ? 'hidden' : {}}
      animate={animated ? 'visible' : {}}
      className="absolute bottom-0 w-full border-t border-[#283339] bg-[#101c22]/80 backdrop-blur-sm"
    >
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 divide-x divide-[#283339]/0 md:divide-x md:divide-[#283339]">
          {stats.map((stat, idx) => (
            <ItemComponent
              key={idx}
              variants={animated ? itemVariants : {}}
              className="flex flex-col items-center md:items-start px-4 first:pl-0"
            >
              <span className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">
                {stat.label}
              </span>
              <div className="flex items-end gap-2">
                <span className="text-white text-xl font-bold font-mono">
                  {stat.value}
                  {stat.unit && <span className="text-sm text-slate-400 font-normal ml-1">{stat.unit}</span>}
                </span>
                {stat.trend && (
                  <span className={`text-xs font-bold mb-1 ${stat.trendColor || 'text-emerald-500'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
            </ItemComponent>
          ))}
        </div>
      </div>
    </Component>
  )
}
