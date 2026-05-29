// components/documents/documents-grid.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, Download, Upload } from 'lucide-react'
import { DocumentCard } from './document-card'
import { INITIAL_DOCUMENTS, statusConfig } from './documents-constants'

export function DocumentsGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredDocuments = INITIAL_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-midnight border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-midnight border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-midnight border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="id">ID Document</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="license">License</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-violet-core hover:bg-violet-deep">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = INITIAL_DOCUMENTS.filter((d) => d.status === key).length
          const Icon = config.icon
          return (
            <div key={key} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{config.label}</p>
                  <p className="text-2xl font-semibold text-cloud font-mono">{count}</p>
                </div>
                <div className={cn('p-2 rounded-lg', config.className)}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc, index) => (
          <DocumentCard key={doc.id} doc={doc} index={index} />
        ))}
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-violet-core transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-xl bg-midnight mx-auto mb-4 flex items-center justify-center group-hover:bg-violet-core/20 transition-colors">
          <Plus className="w-6 h-6 text-slate-400 group-hover:text-violet-glow transition-colors" />
        </div>
        <h3 className="text-sm font-medium text-cloud mb-1">Drop files here to upload</h3>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOC, JPG, PNG up to 10MB
        </p>
      </div>
    </div>
  )
}
