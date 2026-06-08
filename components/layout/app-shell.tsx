// components/layout/app-shell.tsx
'use client'

import { useState, useEffect } from 'react'
import { Sidebar, TopNavbar } from '@/components/layout/sidebar'
import { CommandPalette } from '@/components/layout/command-palette'
import { cn } from '@/lib/utils'
import { employeeService } from '@/services/employee-service'

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export interface UserProfile {
  fullName: string
  email: string
  roleName: string
  initials: string
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'John Doe',
    email: 'john@acmecorp.com',
    roleName: 'HR Manager',
    initials: 'JD',
  })

  useEffect(() => {
    // 1. Read cookies client-side post-hydration
    const email = getCookie('auth_email') || 'john@acmecorp.com'
    const username = getCookie('auth_username') || 'John Doe'
    const nameParts = username.split(/[._@]/).filter(Boolean)
    const inferredName = nameParts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')
    const initialProfile = {
      fullName: inferredName || 'John Doe',
      email,
      roleName: 'HR Manager',
      initials: inferredName
        ? inferredName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
        : 'JD',
    }

    setUserProfile(initialProfile)

    // 2. Fetch full details from backend
    async function loadProfile() {
      try {
        const { data: employees } = await employeeService.getEmployees({ page_size: 100 })
        const match = employees.find(
          (emp) =>
            emp.user.email.toLowerCase() === email.toLowerCase() ||
            emp.user.username.toLowerCase() === username.toLowerCase()
        )

        if (match) {
          setUserProfile({
            fullName: match.full_name,
            email: match.user.email,
            roleName: match.designation || match.role_name || 'Employee',
            initials: match.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2),
          })
        } else {
          // Fallback to first employee or default details
          const first = employees[0]
          if (first) {
            setUserProfile({
              fullName: first.full_name,
              email: first.user.email,
              roleName: first.designation || first.role_name || 'Employee',
              initials: first.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2),
            })
          }
        }
      } catch (err) {
        console.warn('🔴 Network error fetching user profile detail:', err)
      }
    }

    loadProfile()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out pl-0 min-h-screen flex flex-col",
          collapsed ? "md:pl-[72px]" : "md:pl-[240px]"
        )}
      >
        <TopNavbar
          onSearchOpen={() => setSearchOpen(true)}
          onMenuClick={() => setMobileOpen(true)}
          userProfile={userProfile}
        />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
          {children}
        </main>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
