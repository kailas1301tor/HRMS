// components/employees/employee-table-filters.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, Download } from 'lucide-react'
import type { DropdownData } from '@/services/employee-service'

interface EmployeeTableFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  departmentFilter: string
  onDepartmentChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  dropdowns: DropdownData | null
  onAddClick: () => void
}

export function EmployeeTableFilters({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  dropdowns,
  onAddClick,
}: EmployeeTableFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full bg-midnight border-border rounded-xl text-sm"
          />
        </div>

        {/* Department Filter */}
        <Select
          value={departmentFilter || 'all'}
          onValueChange={(val) => onDepartmentChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-44 bg-midnight border-border rounded-xl text-sm text-slate-300">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {dropdowns?.departments.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter || 'all'}
          onValueChange={(val) => onStatusChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-40 bg-midnight border-border rounded-xl text-sm text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {dropdowns?.status_choices.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 justify-end sm:justify-start">
        <Button variant="outline" className="gap-2 rounded-xl h-10 flex-1 sm:flex-none justify-center">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button
          onClick={onAddClick}
          className="gap-2 bg-violet-core hover:bg-violet-deep rounded-xl h-10 font-semibold flex-1 sm:flex-none justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>
    </div>
  )
}
