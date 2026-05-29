// components/employees/employee-table-row.tsx
'use client'

import { motion } from 'framer-motion'
import { Calendar, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Employee } from './employee-table'

interface EmployeeTableRowProps {
  employee: Employee
  index: number
  onSelect: () => void
  onToggleStatus: (employee: Employee, active: boolean) => void
  onEdit: (employee: Employee) => void
  onDelete: (id: number) => void
  departmentConfig: Record<string, { label: string; className: string }>
  statusConfig: Record<string, { label: string; className: string; dotClassName: string }>
}

export function EmployeeTableRow({
  employee,
  index,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
  departmentConfig,
  statusConfig,
}: EmployeeTableRowProps) {
  // Safe fallback for initials
  const initials = employee.full_name
    ? employee.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM'

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border/50 hover:bg-violet-core/5 transition-colors duration-150 cursor-pointer"
      onClick={onSelect}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-cloud">{employee.full_name}</p>
            <p className="text-xs font-mono text-violet-glow">{employee.employee_id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            departmentConfig[employee.department]?.className ||
              'bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 rounded-lg text-xs font-medium'
          )}
        >
          {employee.department}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-300 font-medium">{employee.designation}</span>
      </td>
      <td className="px-4 py-3">
        <span className={statusConfig[employee.status]?.className || statusConfig['Active'].className}>
          <span className={statusConfig[employee.status]?.dotClassName || statusConfig['Active'].dotClassName} />
          {employee.status}
        </span>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={employee.status === 'Active'}
          onCheckedChange={(checked) => onToggleStatus(employee, checked)}
        />
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm text-slate-300 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400/80" />
          {employee.joined_date ? new Date(employee.joined_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSelect}>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(employee); }}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(employee.id); }}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  )
}
