// components/layout/useCommandPalette.ts
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface UseCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface UseCommandPaletteReturn {
  search: string
  setSearch: (val: string) => void
  handleSelect: (href: string) => void
}

export function useCommandPalette({
  open,
  onOpenChange,
}: UseCommandPaletteProps): UseCommandPaletteReturn {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const handleSelect = useCallback(
    (href: string) => {
      onOpenChange(false)
      setSearch('')
      router.push(href)
    },
    [router, onOpenChange]
  )

  return {
    search,
    setSearch,
    handleSelect,
  }
}
