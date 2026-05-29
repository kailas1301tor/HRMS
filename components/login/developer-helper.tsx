// components/login/developer-helper.tsx
'use client'

import { motion, Variants } from 'framer-motion'

interface DeveloperHelperProps {
  isLoading: boolean
  onAutofill: () => void
  variants: Variants
}

export function DeveloperHelper({ isLoading, onAutofill, variants }: DeveloperHelperProps) {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <motion.div
      variants={variants}
      className="mt-6 flex flex-col items-center bg-carbon/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center"
    >
      <p className="text-xs text-slate-400 font-medium font-sans">Developer Helper Panel</p>
      <p className="text-[11px] text-slate-500 mt-1 font-sans">
        Click the button below to pre-fill test login credentials.
      </p>
      <button
        onClick={onAutofill}
        disabled={isLoading}
        type="button"
        className="mt-2.5 px-3 py-1.5 bg-violet-core/20 hover:bg-violet-core/30 text-violet-glow text-xs font-semibold rounded-lg border border-violet-core/30 transition-all cursor-pointer font-sans"
      >
        Autofill Test Account
      </button>
    </motion.div>
  )
}
