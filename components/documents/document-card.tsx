// components/documents/document-card.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { 
  employeeDocumentService, 
  companyDocumentService,
  type EmployeeDocument,
  type CompanyDocument
} from '@/services/document-service'
import { statusConfig, fileTypeIcons } from './documents-constants'

interface DocumentCardProps {
  doc: EmployeeDocument | CompanyDocument
  type: 'employee' | 'company'
  index: number
  onDeleteSuccess: () => void
}

function isEmployeeDocument(doc: EmployeeDocument | CompanyDocument): doc is EmployeeDocument {
  return 'employee' in doc
}

export function DocumentCard({ doc, type, index, onDeleteSuccess }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // 1. Normalize Status
  const statusLower = (doc.status || '').toLowerCase()
  const normalizedStatus: 'valid' | 'expiring' | 'expired' =
    statusLower.includes('expired') ? 'expired' :
    statusLower.includes('expiring') || statusLower.includes('soon') ? 'expiring' :
    'valid'

  const status = statusConfig[normalizedStatus]

  // 2. Parse file type from URL
  const getFileType = (url: string): 'pdf' | 'doc' | 'img' => {
    if (!url) return 'pdf'
    const cleanUrl = url.split('?')[0] // remove query params if any
    const ext = cleanUrl.split('.').pop()?.toLowerCase() || ''
    if (ext === 'pdf') return 'pdf'
    if (['doc', 'docx'].includes(ext)) return 'doc'
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'img'
    return 'pdf'
  }
  
  const fileTypeKey = getFileType(doc.file_url || '')
  const fileType = fileTypeIcons[fileTypeKey]
  const FileIcon = fileType.icon

  // 3. Dynamic metadata fields depending on the tab type using type guards instead of casts
  const isEmp = isEmployeeDocument(doc)
  const docName = isEmp
    ? doc.document_type_name || doc.document_type
    : doc.company_document_type_name || doc.company_document_type

  const subtitleLabel = isEmp
    ? doc.employee_name || doc.employee
    : doc.branch_name || doc.branch

  const docNumber = isEmp
    ? doc.document_number
    : doc.document_number || 'N/A'

  // 4. Calculate Expiry days dynamically
  const getDaysUntilExpiry = (expiryDateStr: string): number => {
    if (!expiryDateStr) return 0
    const expiry = new Date(expiryDateStr)
    const today = new Date()
    expiry.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const daysUntilExpiry = getDaysUntilExpiry(doc.expiry_date)

  // 5. Actions
  const handleDownload = () => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank')
    } else {
      toast.error('No file URL available for download')
    }
  }

  const handleDelete = async () => {
    const label = type === 'employee' ? 'employee' : 'company'
    if (!window.confirm(`Are you sure you want to delete this ${label} document?`)) {
      return
    }

    setIsDeleting(true)
    try {
      if (type === 'employee') {
        await employeeDocumentService.delete(doc.id)
      } else {
        await companyDocumentService.delete(doc.id)
      }
      toast.success('Document deleted successfully!')
      onDeleteSuccess()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to delete document'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'bg-card border border-border/80 rounded-2xl p-5 border-l-2 hover:border-violet-core/80 transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.15)]',
        status.borderColor
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105', fileType.color)}>
          <FileIcon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase', status.className)}>
            {status.label}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-midnight"
                aria-label="Document Actions"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                ) : (
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border text-xs rounded-xl shadow-xl">
              <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2 text-slate-400" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2 text-slate-400" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-cloud mb-1.5 truncate group-hover:text-violet-glow transition-colors">
        {docName}
      </h3>
      <p className="text-xs text-muted-foreground mb-4 flex items-center justify-between font-medium">
        <span className="truncate max-w-[180px]">{subtitleLabel}</span>
        {docNumber && docNumber !== 'N/A' && (
          <span className="font-mono text-[10px] bg-midnight px-1.5 py-0.5 rounded text-violet-glow/90 border border-border/20 max-w-[100px] truncate">
            {docNumber}
          </span>
        )}
      </p>

      {/* Date display */}
      <div className="flex flex-col gap-1.5 pt-3 border-t border-border/40 text-xs">
        {!isEmp && doc.issue_date && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Issued</span>
            <span className="font-mono text-cloud font-medium">
              {doc.issue_date}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Expires</span>
          <span
            className={cn(
              'font-mono font-semibold',
              normalizedStatus === 'expired'
                ? 'text-red-400'
                : normalizedStatus === 'expiring'
                ? 'text-amber-400'
                : 'text-cloud'
            )}
          >
            {normalizedStatus === 'expired'
              ? `${Math.abs(daysUntilExpiry)} days ago`
              : `${daysUntilExpiry} days left`}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
