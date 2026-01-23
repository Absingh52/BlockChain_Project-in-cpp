'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-[#283339] glass-panel">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">deployed_code</span>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">BlockExplorer</h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explorer" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">
              Explorer
            </Link>
            <Link href="/transactions" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">
              Transactions
            </Link>
            <Link href="/wallet" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">
              Wallet
            </Link>
            <Link href="/mining" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">
              Mining
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative w-80 group">
            <div className="absolute left-3 text-slate-500 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="w-full bg-[#1c262c] border border-[#283339] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Search by Address / Txn Hash / Block..."
            />
            <div className="absolute right-3 bg-[#283339] px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono border border-[#3b4b54]">
              /
            </div>
          </div>

          {/* Connect Wallet Button */}
          <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-bold transition-all">
            <span className="truncate">Connect Wallet</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#283339] bg-[#1c262c] p-4">
          <nav className="flex flex-col gap-3">
            <Link href="/explorer" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors block">
              Explorer
            </Link>
            <Link href="/transactions" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors block">
              Transactions
            </Link>
            <Link href="/wallet" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors block">
              Wallet
            </Link>
            <Link href="/mining" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors block">
              Mining
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
