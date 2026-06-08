// components/documents/documents-toolbar.tsx
'use client'

import { Search, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DocumentsToolbarProps {
  tab: 'employee' | 'company'
  localSearch: string
  setLocalSearch: (val: string) => void
  statusFilter: string
  onStatusChange: (val: string) => void
  categoryFilter: string
  onCategoryChange: (val: string) => void
  categories: Array<{ id: number; name: string }>
  onExport: () => void
  onUploadClick: () => void
}

export function DocumentsToolbar({
  tab,
  localSearch,
  setLocalSearch,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onExport,
  onUploadClick,
}: DocumentsToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${tab === 'employee' ? 'employee' : 'company'} documents...`}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 w-full bg-midnight border-border rounded-xl h-10 text-xs text-slate-300"
          />
        </div>

        {/* Status filter dropdown */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-40 bg-midnight border-border rounded-xl h-10 text-xs text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="valid">Valid</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        {/* Category/Type Filter dropdown */}
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-44 bg-midnight border-border rounded-xl h-10 text-xs text-slate-300">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 justify-end sm:justify-start">
        <Button
          variant="outline"
          onClick={onExport}
          className="gap-2 rounded-xl h-10 text-xs flex-1 sm:flex-none justify-center"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button
          onClick={onUploadClick}
          className="gap-2 bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl h-10 text-xs flex-1 sm:flex-none justify-center"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>
    </div>
  )
}
