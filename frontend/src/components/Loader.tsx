'use client'

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background-dark">
      <div className="relative size-32">
        <div className="absolute inset-0 rounded-full border-4 border-[#283339]"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary">deployed_code</span>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
