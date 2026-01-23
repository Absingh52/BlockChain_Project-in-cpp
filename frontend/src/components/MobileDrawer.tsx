'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-16 left-0 h-[calc(100vh-64px)] w-64 z-50 bg-[#101c22] border-r border-[#283339] overflow-y-auto md:hidden"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
