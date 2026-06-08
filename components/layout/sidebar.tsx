// components/layout/sidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Package,
  MessageSquare,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Bell,
  User,
  LogOut,
  Search,
  Menu,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from './useSidebar'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', section: 'Main' },
  { href: '/employees', icon: Users, label: 'Employees', section: 'Main' },
  { href: '/attendance', icon: Clock, label: 'Attendance', section: 'Main' },
  { href: '/documents', icon: FileText, label: 'Documents', section: 'Main' },
  { href: '/assets', icon: Package, label: 'Assets', section: 'Main' },
  { href: '/requests', icon: MessageSquare, label: 'Requests', section: 'Operations' },
  { href: '/payroll', icon: DollarSign, label: 'Payroll', section: 'Operations' },
  { href: '/reports', icon: BarChart3, label: 'Reports', section: 'Operations' },
  { href: '/settings', icon: Settings, label: 'Settings', section: 'System' },
]

const sections = ['Main', 'Operations', 'System']

import type { UserProfile } from './app-shell'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (val: boolean) => void
  userProfile: UserProfile
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, userProfile }: SidebarProps) {
  const { handleLogout, pathname } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  // Track viewport size to dynamically shift layout animations
  useEffect(() => {
    const checkMobile = () => {
      const mobileMode = window.innerWidth < 768
      setIsMobile(mobileMode)
      if (!mobileMode) {
        setMobileOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setMobileOpen])

  // Automatically close mobile sidebar on navigation transition
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  return (
    <motion.aside
      initial={false}
      animate={
        isMobile
          ? { x: mobileOpen ? 0 : -240, width: 240 }
          : { x: 0, width: collapsed ? 72 : 240 }
      }
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-midnight border-r border-border flex flex-col z-50 shadow-2xl md:shadow-none"
    >
      {/* Sidebar Header / Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 w-full p-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 text-left overflow-hidden"
              >
                <p className="text-sm font-semibold text-cloud truncate">HRMS Portal</p>
                <p className="text-xs text-muted-foreground truncate">Management</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        {sections.map((section) => (
          <div key={section} className="mb-6">
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  {section}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 h-10 px-3 rounded-lg transition-all duration-150',
                        isActive
                          ? 'bg-gradient-to-r from-violet-core to-violet-deep text-white font-medium shadow-md shadow-violet-core/10'
                          : 'text-slate-300 hover:bg-carbon hover:text-cloud'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                      <AnimatePresence>
                        {(!collapsed || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  )
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Session profile */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-carbon rounded-lg p-2 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs font-mono">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-cloud truncate">{userProfile.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userProfile.roleName}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover border border-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="w-4 h-4 mr-2 text-slate-400" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2 text-slate-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle trigger (Desktop Only) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-carbon border border-border rounded-full flex items-center justify-center text-slate-300 hover:text-cloud hover:border-violet-core transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}
    </motion.aside>
  )
}

interface TopNavbarProps {
  onSearchOpen: () => void
  onMenuClick: () => void
  userProfile: UserProfile
}

export function TopNavbar({ onSearchOpen, onMenuClick, userProfile }: TopNavbarProps) {
  const { handleLogout, breadcrumbs } = useSidebar()

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
      {/* Drawer Toggle & Breadcrumbs */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-carbon rounded-lg text-slate-400 hover:text-cloud md:hidden transition-colors cursor-pointer"
          aria-label="Open main menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav className="hidden xs:flex items-center gap-2 text-xs sm:text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <Link
                href={crumb.href}
                className={cn(
                  'transition-colors',
                  index === breadcrumbs.length - 1
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 h-9 px-3 sm:px-4 bg-midnight border border-border rounded-full text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-violet-core transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-carbon text-[9px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <button className="relative p-2 hover:bg-carbon rounded-lg transition-colors cursor-pointer" aria-label="Notifications">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-core rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 hover:bg-carbon rounded-lg transition-colors cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs font-mono">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold text-cloud">{userProfile.fullName}</span>
                <span className="text-xs text-muted-foreground">{userProfile.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2 text-slate-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
