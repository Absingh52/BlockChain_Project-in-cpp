'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiOutlineHome,
  HiOutlineWallet,
  HiOutlinePaperAirplane,
  HiOutlineEye,
  HiOutlineMoon,
  HiOutlineSun,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2'

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark'
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const next = !isDark
    setIsDark(next)

    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'Dashboard', icon: HiOutlineHome },
    { href: '/wallet', label: 'Wallet', icon: HiOutlineWallet },
    { href: '/send', label: 'Send', icon: HiOutlinePaperAirplane },
    { href: '/explorer', label: 'Explorer', icon: HiOutlineEye },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
            >
              Chain
            </motion.div>
            <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400">
              Blockchain
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(href)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {isDark ? (
                <HiOutlineSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <HiOutlineMoon className="w-5 h-5 text-slate-600" />
              )}
            </motion.button>

            {/* Mobile Menu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? (
                <HiXMark className="w-6 h-6" />
              ) : (
                <HiBars3 className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Nav */}
        <motion.nav
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col gap-1 py-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive(href)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.nav>
      </div>
    </header>
  )
}
