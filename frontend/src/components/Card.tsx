'use client'

import { motion } from 'framer-motion'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  highlight?: boolean
}

export function Card({ title, subtitle, children, className = '', highlight = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${highlight ? 'ring-2 ring-blue-500 ring-opacity-50 dark:ring-opacity-40' : ''} ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="text-lg font-semibold text-slate-900 dark:text-white"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="text-sm text-slate-600 dark:text-slate-400 mt-1"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.16 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
