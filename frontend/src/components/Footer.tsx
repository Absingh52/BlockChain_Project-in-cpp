'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#101c22] border-t border-[#283339] py-12 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 text-white">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined text-2xl">deployed_code</span>
          </div>
          <span className="text-lg font-bold">BlockExplorer</span>
        </div>

        {/* Links Section */}
        <div className="flex gap-8 text-sm text-slate-400">
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            API Documentation
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-slate-500 text-sm">
          © 2024 BlockExplorer. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
