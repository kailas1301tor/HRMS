// components/assets/useAssetDisposalTab.ts
'use client'

import { useEffect, useState } from 'react'
import { assetService, type AssetDisposal } from '@/services/asset-service'

export interface UseAssetDisposalTabReturn {
  disposal: AssetDisposal | null
  isLoading: boolean
  formatDate: (dateStr: string) => string
}

export function useAssetDisposalTab(assetId: number): UseAssetDisposalTabReturn {
  const [disposal, setDisposal] = useState<AssetDisposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDisposal() {
      setIsLoading(true)
      try {
        const data = await assetService.getAssetDisposal(assetId)
        setDisposal(data)
      } catch (err) {
        console.error('Failed to load asset disposal records:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDisposal()
  }, [assetId])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return {
    disposal,
    isLoading,
    formatDate,
  }
}
