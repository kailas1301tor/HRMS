// components/assets/view-asset-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { Calendar, DollarSign, ShieldAlert, MapPin, Building, Info, Clock, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { assetService, type BackendAsset } from '@/services/asset-service'
import { getAssetTypeConfig, getStatusConfig } from './assets-constants'
import { cn } from '@/lib/utils'

interface ViewAssetModalProps {
  assetId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewAssetModal({ assetId, open, onOpenChange }: ViewAssetModalProps) {
  const [asset, setAsset] = useState<BackendAsset | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && assetId !== null) {
      const fetchDetail = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const data = await assetService.getAssetById(assetId)
          setAsset(data)
        } catch (err: any) {
          setError(err.message || 'Failed to load asset details')
        } finally {
          setIsLoading(false)
        }
      }
      fetchDetail()
    } else {
      setAsset(null)
    }
  }, [open, assetId])

  const typeConfig = asset ? getAssetTypeConfig(asset.asset_type) : null
  const statusConfig = asset ? getStatusConfig(asset.status) : null
  const TypeIcon = typeConfig?.icon || Info

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCost = (costStr: string | null) => {
    if (!costStr) return 'N/A'
    const value = parseFloat(costStr)
    return isNaN(value) ? 'N/A' : `AED ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-foreground border border-border/80 rounded-2xl max-w-md p-6 shadow-2xl overflow-y-auto max-h-[90vh] transition-colors duration-200">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            Asset Information
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6 py-4">
            {/* Header section skeleton */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-200/80 dark:bg-slate-800/80" />
                  <Skeleton className="h-3 w-16 bg-slate-200/80 dark:bg-slate-800/80" />
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <Skeleton className="h-5 w-20 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
                <Skeleton className="h-4 w-12 rounded bg-slate-200/80 dark:bg-slate-800/80" />
              </div>
            </div>

            {/* Main Info Fields skeleton */}
            <div className="grid grid-cols-1 gap-4 bg-slate-100/50 dark:bg-midnight/50 p-4 border border-border/40 dark:border-border/50 rounded-xl">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-slate-200/80 dark:bg-slate-800/80" />
                  <Skeleton className="h-4 w-36 bg-slate-200/80 dark:bg-slate-800/80" />
                </div>
              ))}
            </div>

            {/* Financials & Dates grid skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border/40 dark:border-border/50 p-3 rounded-xl space-y-2">
                  <Skeleton className="h-3 w-16 bg-slate-200/80 dark:bg-slate-800/80" />
                  <Skeleton className="h-4 w-24 bg-slate-200/80 dark:bg-slate-800/80" />
                </div>
              ))}
            </div>

            {/* System Info skeleton */}
            <div className="flex justify-between items-center pt-2 border-t border-border/30">
              <Skeleton className="h-3 w-24 bg-slate-200/80 dark:bg-slate-800/80" />
              <Skeleton className="h-3 w-24 bg-slate-200/80 dark:bg-slate-800/80" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <ShieldAlert className="w-10 h-10 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-cloud">Failed to load details</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">{error}</p>
            </div>
          </div>
        ) : asset ? (
          <div className="space-y-6 py-4">
            {/* Header section with icon and status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-colors', typeConfig?.color)}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-cloud leading-tight">{asset.name}</h3>
                  <p className="text-xs font-mono text-violet-glow mt-0.5">
                    AST-{String(asset.id).padStart(3, '0')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {statusConfig && (
                  <span className={cn('px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase shadow-sm', statusConfig.className)}>
                    {statusConfig.label}
                  </span>
                )}
                <div className="flex gap-1.5">
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider border transition-colors',
                    asset.is_active 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  )}>
                    {asset.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {asset.deleted && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                      Deleted
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Info Fields */}
            <div className="grid grid-cols-1 gap-4 bg-slate-100/50 dark:bg-midnight/50 p-4 border border-border/40 dark:border-border/50 rounded-xl transition-colors">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-400">Serial Number</span>
                <span className="font-mono text-cloud font-medium">{asset.serial_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-400">Type</span>
                <span className="text-cloud font-medium">{asset.asset_type || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-400">Category</span>
                <span className="text-cloud font-medium">{asset.asset_category || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> Department
                </span>
                <span className="text-cloud font-medium uppercase tracking-wider text-[11px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {asset.department || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location
                </span>
                <span className="text-cloud font-medium">
                  {asset.location} {asset.sub_location ? `(${asset.sub_location})` : ''}
                </span>
              </div>
            </div>

            {/* Financials & Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border/40 dark:border-border/50 p-3 rounded-xl space-y-1 shadow-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-lime-400" /> Cost
                </span>
                <p className="text-sm font-semibold font-mono text-cloud">{formatCost(asset.purchase_cost)}</p>
              </div>
              <div className="bg-card border border-border/40 dark:border-border/50 p-3 rounded-xl space-y-1 shadow-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-violet-glow" /> Purchase Date
                </span>
                <p className="text-xs font-semibold text-cloud">{formatDate(asset.purchase_date)}</p>
              </div>
              <div className="bg-card border border-border/40 dark:border-border/50 p-3 rounded-xl space-y-1 shadow-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Warranty Period
                </span>
                <p className="text-sm font-semibold text-cloud">
                  {asset.warranty_period ? `${asset.warranty_period} Months` : 'N/A'}
                </p>
              </div>
              <div className="bg-card border border-border/40 dark:border-border/50 p-3 rounded-xl space-y-1 shadow-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" /> Service Due
                </span>
                <p className="text-xs font-semibold text-cloud">{formatDate(asset.service_due_date)}</p>
              </div>
            </div>

            {/* System Info */}
            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-border/30">
              <span>Created: {new Date(asset.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(asset.updated_at).toLocaleString()}</span>
            </div>
          </div>
        ) : null}

        <DialogFooter className="pt-2">
          <Button onClick={() => onOpenChange(false)} className="w-full bg-violet-core hover:bg-violet-deep text-white focus-ring">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
