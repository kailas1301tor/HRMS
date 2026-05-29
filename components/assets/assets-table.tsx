// components/assets/assets-table.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Search, Plus, Download, Loader2, Info, HelpCircle } from 'lucide-react'
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AssetsTableRow } from './assets-table-row'
import { INITIAL_ASSETS } from './assets-constants'
import { assetService, type BackendAsset, type AssetDropdowns } from '@/services/asset-service'
import { departmentService, type Department } from '@/services/department-service'
import { AddAssetModal } from './add-asset-modal'
import { ViewAssetModal } from './view-asset-modal'

export function AssetsTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [assetsList, setAssetsList] = useState<BackendAsset[]>([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 })
  const [dropdowns, setDropdowns] = useState<AssetDropdowns | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isTableLoading, setIsTableLoading] = useState(false)

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<BackendAsset | null>(null)
  const [viewAssetId, setViewAssetId] = useState<number | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // URL State filters
  const searchQuery = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const typeFilter = searchParams.get('asset_type') || 'all'
  const pageParam = Number(searchParams.get('page')) || 1

  const fetchAssets = async () => {
    setIsTableLoading(true)
    try {
      const response = await assetService.getAssets(
        {
          page: pageParam,
          page_size: 10,
          search: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          asset_type: typeFilter !== 'all' ? typeFilter : undefined,
        },
        INITIAL_ASSETS
      )
      setAssetsList(response.data)
      setPagination({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      })
    } catch (error) {
      toast.error('Failed to load assets list')
    } finally {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [searchQuery, statusFilter, typeFilter, pageParam])

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [dropData, deptData] = await Promise.all([
          assetService.getAssetDropdowns(),
          departmentService.getDepartments(),
        ])
        setDropdowns(dropData)
        setDepartments(deptData)
      } catch (err) {
        console.error('Failed to fetch assets metadata filters:', err)
      }
    }
    loadMetadata()
  }, [])

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  const executeDelete = async () => {
    if (deleteTargetId === null) return
    setIsDeleting(true)
    try {
      await assetService.deleteAsset(deleteTargetId)
      toast.success('Asset disposed successfully')
      setDeleteTargetId(null)
      fetchAssets()
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispose asset')
    } finally {
      setIsDeleting(false)
    }
  }

  // Statistics
  const totalValue = assetsList.reduce((sum, a) => sum + (a.purchase_cost ? parseFloat(a.purchase_cost) : 0), 0)
  const inServiceCount = assetsList.filter((a) => {
    const s = a.status?.toLowerCase() || ''
    return s.includes('assigned') || s.includes('service')
  }).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => updateQueryParams({ search: e.target.value, page: '1' })}
              className="pl-9 bg-midnight border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={(val) => updateQueryParams({ status: val, page: '1' })}>
            <SelectTrigger className="w-40 bg-midnight border-border">
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
            <SelectTrigger className="w-40 bg-midnight border-border">
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
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" className="gap-2 border-border hover:bg-slate-800">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button
            onClick={() => {
              setSelectedAsset(null)
              setIsAddOpen(true)
            }}
            className="gap-2 bg-violet-core hover:bg-violet-deep text-white"
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
                  <tr key={i} className="border-b border-border/50 animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800" />
                        <div className="space-y-1.5"><div className="h-3 bg-slate-700 rounded w-28" /><div className="h-2 bg-slate-800 rounded w-16" /></div>
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className={cn("h-4 bg-slate-800 rounded w-20", j === 4 ? "ml-auto" : "")} /></td>
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
                      onViewDetails={(id) => {
                        setViewAssetId(id)
                        setIsViewOpen(true)
                      }}
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

      <ViewAssetModal
        assetId={viewAssetId}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
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
