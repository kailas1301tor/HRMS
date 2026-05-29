'use client'

import { useState } from 'react'
import { Sidebar, TopNavbar } from '@/components/layout/sidebar'
import { CommandPalette } from '@/components/layout/command-palette'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[240px] transition-all duration-200">
        <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
        <main className="max-w-[1280px] mx-auto px-6 py-8">
          {children}
        </main>
      </div>
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
