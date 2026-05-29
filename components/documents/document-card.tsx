// components/documents/document-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Download, Upload, Eye, Trash2, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Document } from './documents-constants'
import { statusConfig, fileTypeIcons } from './documents-constants'

interface DocumentCardProps {
  doc: Document
  index: number
}

export function DocumentCard({ doc, index }: DocumentCardProps) {
  const status = statusConfig[doc.status]
  const fileType = fileTypeIcons[doc.fileType]
  const FileIcon = fileType.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'bg-card border border-border rounded-2xl p-5 border-l-2 hover:border-violet-core transition-colors group',
        status.borderColor
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2 rounded-lg', fileType.color)}>
          <FileIcon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-1 rounded-full text-[10px] font-medium', status.className)}>
            {status.label}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Replace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h3 className="text-sm font-medium text-cloud mb-1 truncate">{doc.name}</h3>
      <p className="text-xs text-muted-foreground mb-4">
        <span className="font-mono text-violet-glow">{doc.employeeId}</span>
        {' · '}
        {doc.size}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Expires</span>
        <span
          className={cn(
            'font-mono',
            doc.status === 'expired'
              ? 'text-red-400'
              : doc.status === 'expiring'
              ? 'text-amber-400'
              : 'text-cloud'
          )}
        >
          {doc.status === 'expired'
            ? `${Math.abs(doc.daysUntilExpiry)} days ago`
            : `${doc.daysUntilExpiry} days left`}
        </span>
      </div>
    </motion.div>
  )
}
