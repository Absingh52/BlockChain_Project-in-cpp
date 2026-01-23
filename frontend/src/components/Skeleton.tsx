'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  count?: number
  circle?: boolean
  className?: string
}

export default function Skeleton({
  width = '100%',
  height = '20px',
  count = 1,
  circle = false,
  className = '',
}: SkeletonProps) {
  const items = Array.from({ length: count })

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((_, idx) => (
        <motion.div
          key={idx}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`bg-gradient-to-r from-[#283339] via-[#3b4b54] to-[#283339] bg-[length:200%_100%] animate-pulse ${
            circle ? 'rounded-full' : 'rounded'
          }`}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
          }}
        />
      ))}
    </div>
  )
}
