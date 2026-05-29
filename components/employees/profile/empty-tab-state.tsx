// components/employees/profile/empty-tab-state.tsx
'use client'

import { Inbox } from 'lucide-react'

interface EmptyTabStateProps {
  title: string
  description: string
}

export function EmptyTabState({ title, description }: EmptyTabStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-midnight border border-border/40 flex items-center justify-center text-slate-500 mb-4 shadow-sm animate-pulse">
        <Inbox className="w-5.5 h-5.5 text-slate-400" />
      </div>
      <h4 className="text-sm font-semibold text-cloud mb-1 font-sans">{title}</h4>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-sans">{description}</p>
    </div>
  )
}
