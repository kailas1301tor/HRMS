// components/assets/useAssetHistoryTab.ts
'use client'

import { useEffect, useState } from 'react'
import { assetService, type AssetHistoryEntry } from '@/services/asset-service'
import { User, Building, Wrench, RefreshCw, Trash2, HelpCircle } from 'lucide-react'

export interface UseAssetHistoryTabReturn {
  history: AssetHistoryEntry[]
  isLoading: boolean
  getActionConfig: (actionName?: string) => {
    icon: typeof User
    color: string
  }
}

export function useAssetHistoryTab(assetId: number): UseAssetHistoryTabReturn {
  const [history, setHistory] = useState<AssetHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true)
      try {
        const data = await assetService.getAssetHistory(assetId)
        // Sort history by date descending
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setHistory(sorted)
      } catch (err) {
        console.error('Failed to load asset history logs:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [assetId])

  const getActionConfig = (actionName: string = '') => {
    const action = actionName.toLowerCase()
    if (action.includes('assign')) {
      return { icon: User, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' }
    }
    if (action.includes('transfer')) {
      return { icon: RefreshCw, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' }
    }
    if (action.includes('maintenance') || action.includes('repair')) {
      return { icon: Wrench, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' }
    }
    if (action.includes('return')) {
      return { icon: Building, color: 'text-violet-glow bg-violet-core/15 border-violet-core/30' }
    }
    if (action.includes('dispose') || action.includes('delete')) {
      return { icon: Trash2, color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' }
    }
    return { icon: HelpCircle, color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' }
  }

  return {
    history,
    isLoading,
    getActionConfig,
  }
}
