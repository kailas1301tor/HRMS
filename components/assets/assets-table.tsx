// components/assets/assets-table.tsx
'use client'

import { AnimatePresence } from 'framer-motion'
import { Search, Plus, Download, Loader2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { AssetsTableRow } from './assets-table-row'
import { type BackendAsset } from '@/services/asset-service'
import { AddAssetModal } from './add-asset-modal'
import { useAssetsTable } from './useAssetsTable'

export function AssetsTable() {
  const {
    assetsList,
    pagination,
    dropdowns,
    departments,
    isTableLoading,
    selectedAsset,
    isAddOpen,
    deleteTargetId,
    isDeleting,
    searchQuery,
    statusFilter,
    typeFilter,
    pageParam,
    totalValue,
    inServiceCount,
    setSelectedAsset,
    setIsAddOpen,
    setDeleteTargetId,
    fetchAssets,
    updateQueryParams,
    executeDelete,
  } = useAssetsTable()


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', val: pagination.totalCount },
          { label: 'In Service', val: inServiceCount },
          { label: 'Utilization Rate', val: `${assetsList.length > 0 ? Math.round((inServiceCount / assetsList.length) * 100) : 0}%`, color: 'text-lime-400' },
          { label: 'Total Value', val: `AED ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` }
        ].map((c, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
            <p className={cn("text-2xl font-semibold text-cloud font-mono", c.color)}>{c.val}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => updateQueryParams({ search: e.target.value, page: '1' })}
              className="pl-9 w-full bg-midnight border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={(val) => updateQueryParams({ status: val, page: '1' })}>
            <SelectTrigger className="w-full sm:w-40 bg-midnight border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {dropdowns?.asset_status.map(s => (
                <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(val) => updateQueryParams({ asset_type: val, page: '1' })}>
            <SelectTrigger className="w-full sm:w-40 bg-midnight border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {dropdowns?.asset_types.map(t => (
                <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 justify-end sm:justify-start">
          <Button variant="outline" className="gap-2 border-border text-cloud flex-1 sm:flex-none justify-center">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button
            onClick={() => {
              setSelectedAsset(null)
              setIsAddOpen(true)
            }}
            className="gap-2 bg-violet-core hover:bg-violet-deep text-white flex-1 sm:flex-none justify-center animate-none"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-carbon border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Asset', 'Type', 'Serial Number', 'Department / Location', 'Status', 'Cost (AED)'].map((col, idx) => (
                  <th key={col} className={cn("px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500", idx === 5 ? "text-right" : "text-left")}>
                    {col}
                  </th>
                ))}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3 rounded w-28" />
                          <Skeleton className="h-2 rounded w-16" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className={cn("h-4 rounded w-20", j === 4 ? "ml-auto" : "")} />
                      </td>
                    ))}
                    <td className="px-4 py-3"></td>
                  </tr>
                ))
              ) : assetsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-850 border border-border/40 flex items-center justify-center text-slate-500 mb-2">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-355">No assets found</p>
                      <p className="text-xs text-slate-500 max-w-[280px]">Try updating your search query or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {assetsList.map((asset, index) => (
                    <AssetsTableRow
                      key={asset.id}
                      asset={asset}
                      index={index}
                      onEdit={(a) => {
                        setSelectedAsset(a)
                        setIsAddOpen(true)
                      }}
                      onDelete={(id) => setDeleteTargetId(id)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-cloud">{assetsList.length}</span> of{' '}
              <span className="font-medium text-cloud">{pagination.totalCount}</span> assets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1 || isTableLoading}
                onClick={() => updateQueryParams({ page: String(pagination.currentPage - 1) })}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant="outline"
                  size="sm"
                  className={cn(pagination.currentPage === p && "bg-violet-core/20 border-violet-core text-violet-glow")}
                  disabled={isTableLoading}
                  onClick={() => updateQueryParams({ page: String(p) })}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages || isTableLoading}
                onClick={() => updateQueryParams({ page: String(pagination.currentPage + 1) })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddAssetModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={fetchAssets}
        editAsset={selectedAsset}
        dropdowns={dropdowns}
        departments={departments}
      />


      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg">Dispose Asset</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm mt-2">
              Are you sure you want to dispose/delete this asset? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/40">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="h-10 rounded-xl" disabled={isDeleting}>Cancel</Button>
            </AlertDialogCancel>
            <Button
              onClick={executeDelete}
              className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-xl px-5 flex items-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? 'Disposing...' : 'Dispose'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
