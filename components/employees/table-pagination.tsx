// components/employees/table-pagination.tsx
'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  itemCount: number
  onPageChange: (page: number) => void
  isTableLoading: boolean
}

export function TablePagination({
  currentPage,
  totalPages,
  totalCount,
  itemCount,
  onPageChange,
  isTableLoading,
}: TablePaginationProps) {
  if (totalPages <= 0) return null

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-cloud">{itemCount}</span> of{' '}
        <span className="font-medium text-cloud">{totalCount}</span> employees
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isTableLoading}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant="outline"
            size="sm"
            className={cn(currentPage === p && 'bg-violet-core/20 border-violet-core text-violet-glow')}
            disabled={isTableLoading}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages || isTableLoading}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
