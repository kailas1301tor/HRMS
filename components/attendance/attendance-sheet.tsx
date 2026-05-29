// components/attendance/attendance-sheet.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Calendar,
  Clock,
} from 'lucide-react'
import {
  STATUS_CONFIG,
  SHIFT_CONFIG,
  generateAttendanceData,
} from './attendance-constants'

export function AttendanceSheet() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendanceData] = useState(generateAttendanceData)

  const filteredData = attendanceData.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-midnight rounded-lg">
              <Calendar className="w-4 h-4 text-violet-glow" />
              <span className="text-sm font-medium text-cloud">{formatDate(selectedDate)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-midnight border-border"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-midnight border-border">
              <SelectValue placeholder="Filter by shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = filteredData.filter((d) => d.status === key).length
          return (
            <div key={key} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
              <p className="text-2xl font-semibold text-cloud font-mono">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Attendance Table */}
      <div className="bg-carbon border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Shift
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Time In
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Time Out
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Work Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-border/50 hover:bg-violet-core/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
                          {record.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-cloud">{record.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{record.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-[11px] font-medium',
                        SHIFT_CONFIG[record.shift].className
                      )}
                    >
                      {SHIFT_CONFIG[record.shift].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[record.status].dotColor)} />
                      <span className="text-sm text-slate-300">
                        {STATUS_CONFIG[record.status].label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-mono text-cloud">
                        {record.timeIn || '--:--'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-mono text-cloud">
                        {record.timeOut || '--:--'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-cloud">
                      {record.workHours || '--'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
