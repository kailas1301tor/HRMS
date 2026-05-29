// components/assets/assets-table-row.tsx
'use client'

import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2, MoreHorizontal, Building2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BackendAsset } from '@/services/asset-service'
import { getAssetTypeConfig, getStatusConfig } from './assets-constants'

interface AssetsTableRowProps {
  asset: BackendAsset
  index: number
  onViewDetails: (id: number) => void
  onEdit: (asset: BackendAsset) => void
  onDelete: (id: number) => void
}

export function AssetsTableRow({
  asset,
  index,
  onViewDetails,
  onEdit,
  onDelete,
}: AssetsTableRowProps) {
  const category = getAssetTypeConfig(asset.asset_type)
  const status = getStatusConfig(asset.status)
  const CategoryIcon = category.icon

  const formatCost = (costStr: string | null) => {
    if (!costStr) return '0'
    const value = parseFloat(costStr)
    return isNaN(value) ? '0' : value.toLocaleString()
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border/50 hover:bg-violet-core/5 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', category.color)}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-cloud">{asset.name}</p>
            <p className="text-xs font-mono text-violet-glow">
              AST-{String(asset.id).padStart(3, '0')}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-350">{asset.asset_type || 'Other'}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-mono text-slate-350">{asset.serial_number || '—'}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1 items-start">
          {asset.department ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
              <Building2 className="w-2.5 h-2.5 text-violet-glow" />
              {asset.department}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )}
          {asset.location && (
            <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">
              <MapPin className="w-3 h-3 text-slate-500" />
              {asset.location}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase', status.className)}>
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-cloud tabular-nums font-medium">
          {formatCost(asset.purchase_cost)}
        </span>
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-800">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border/80 text-cloud">
            <DropdownMenuItem onClick={() => onViewDetails(asset.id)} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2 text-slate-400" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(asset)} className="cursor-pointer">
              <Pencil className="w-4 h-4 mr-2 text-slate-400" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Dispose
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  )
}
