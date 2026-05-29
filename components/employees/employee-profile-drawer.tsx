// components/employees/employee-profile-drawer.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  X,
  Building2,
  FileText,
  Package,
  Clock,
  CalendarDays,
  Activity,
  Pencil,
} from 'lucide-react'
import type { Employee } from './employee-table'
import { statusConfig } from './employee-constants'
import { PersonalTab } from './profile/personal-tab'
import { DocumentsTab } from './profile/documents-tab'
import { AssetsTab } from './profile/assets-tab'
import { AttendanceTab } from './profile/attendance-tab'
import { LeaveTab } from './profile/leave-tab'
import { ActivityTab } from './profile/activity-tab'
import { employeeService } from '@/services/employee-service'

interface EmployeeProfileDrawerProps {
  employee: Employee | null
  open: boolean
  onClose: () => void
  onEdit: (employee: Employee) => void
}

const tabs = [
  { id: 'personal', label: 'Personal', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'assets', label: 'Assets', icon: Package },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leave', label: 'Leave', icon: CalendarDays },
  { id: 'activity', label: 'Activity', icon: Activity },
]

export function EmployeeProfileDrawer({ employee, open, onClose, onEdit }: EmployeeProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState('personal')
  const [detailedEmployee, setDetailedEmployee] = useState<Employee | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = async (id: number) => {
    setIsLoadingDetail(true)
    setError(null)
    try {
      const data = await employeeService.getEmployee(id)
      setDetailedEmployee(data)
    } catch (err: any) {
      console.error('Failed to load employee details:', err)
      setError(err.message || 'Failed to load employee details')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  useEffect(() => {
    if (!open || !employee?.id) {
      setDetailedEmployee(null)
      setError(null)
      return
    }
    fetchDetail(employee.id)
  }, [open, employee?.id])

  if (!employee) return null

  const displayEmployee = detailedEmployee || employee

  const initials = displayEmployee.full_name
    ? displayEmployee.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM'

  const currentStatus = displayEmployee.status || 'Active'
  const config = statusConfig[currentStatus] || statusConfig.Active

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-[600px] bg-carbon border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-cloud">{displayEmployee.full_name}</h2>
                    <p className="text-sm text-muted-foreground">{displayEmployee.designation}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className="text-[11px] font-mono font-semibold text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2 py-0.5 rounded-md">
                        {displayEmployee.employee_id}
                      </span>
                      <span className={config.className}>
                        <span className={config.dotClassName} />
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => onEdit(displayEmployee)}>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'bg-violet-core/20 text-violet-glow'
                        : 'text-slate-400 hover:text-cloud hover:bg-midnight'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'personal' && (
                isLoadingDetail ? (
                  <PersonalTabSkeleton />
                ) : error ? (
                  <ErrorStateView message={error} onRetry={() => fetchDetail(employee.id)} />
                ) : (
                  <PersonalTab employee={displayEmployee} />
                )
              )}
              {activeTab === 'documents' && <DocumentsTab />}
              {activeTab === 'assets' && <AssetsTab />}
              {activeTab === 'attendance' && <AttendanceTab />}
              {activeTab === 'leave' && <LeaveTab />}
              {activeTab === 'activity' && <ActivityTab />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function PersonalTabSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Contact Section Skeleton */}
      <div>
        <div className="h-3 w-32 bg-slate-700/80 rounded mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-midnight/60 border border-border/40 rounded-xl p-3 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-2 w-12 bg-slate-800/80 rounded" />
                <div className="h-3 w-20 bg-slate-700/80 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-10 bg-midnight/40 border border-border/45 rounded-xl mt-3 animate-pulse" />
      </div>

      {/* Employment Section Skeleton */}
      <div>
        <div className="h-3 w-28 bg-slate-700/80 rounded mb-3" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-midnight/40 border border-border/40 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2 w-12 bg-slate-850 rounded" />
                <div className="h-3.5 w-24 bg-slate-700/80 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Bank Skeleton */}
      <div className="space-y-4">
        <div className="h-3 w-20 bg-slate-700/80 rounded" />
        <div className="h-20 bg-midnight/40 border border-border/40 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

interface ErrorStateViewProps {
  message: string
  onRetry: () => void
}

function ErrorStateView({ message, onRetry }: ErrorStateViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
        <X className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-cloud mb-1">Failed to Load Details</h4>
      <p className="text-xs text-slate-400 max-w-xs mb-4">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="h-9 rounded-xl">
        Try Again
      </Button>
    </div>
  )
}
