// components/documents/documents-grid.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { DocumentCard } from './document-card'
import { UploadDocumentModal } from './upload-document-modal'
import { statusConfig } from './documents-constants'
import { DocumentsToolbar } from './documents-toolbar'
import {
  employeeDocumentService,
  companyDocumentService,
  type EmployeeDocument,
  type CompanyDocument,
  type DocumentStatusCounts
} from '@/services/document-service'
import { toast } from 'sonner'

export function DocumentsGrid() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 1. Get filter states from URL search parameters (Single Source of Truth)
  const tab = (searchParams.get('tab') as 'employee' | 'company') || 'employee'
  const statusFilter = searchParams.get('status') || 'all'
  const categoryFilter = searchParams.get('category') || 'all'
  const urlSearchQuery = searchParams.get('search') || ''

  // Local state for search input to prevent page lag while typing
  const [localSearch, setLocalSearch] = useState(urlSearchQuery)

  // 2. Fetch Data States
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Array<EmployeeDocument | CompanyDocument>>([])
  const [counts, setCounts] = useState<DocumentStatusCounts>({ valid: 0, expiring_soon: 0, expired: 0 })
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // 3. Helper to update URL search parameters
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    router.replace(`${pathname}?${nextParams.toString()}`)
  }

  // Sync local search state with URL query parameters
  useEffect(() => {
    setLocalSearch(urlSearchQuery)
  }, [urlSearchQuery])

  // Debounced search query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== urlSearchQuery) {
        updateQueryParams({ search: localSearch })
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, urlSearchQuery])

  // 4. Fetch main list, counts, and category dropdown choices
  const loadData = async (signal?: AbortSignal) => {
    setLoading(true)

    try {
      const docTypeParam = categoryFilter !== 'all' ? categoryFilter : undefined
      const statusParam = statusFilter !== 'all' ? statusFilter : undefined
      const searchParam = urlSearchQuery || undefined

      if (tab === 'employee') {
        const [countsData, docsList, dropdowns] = await Promise.all([
          employeeDocumentService.getStatusCounts(signal),
          employeeDocumentService.getAll({
            search: searchParam,
            document_type: docTypeParam,
            status: statusParam
          }, signal),
          employeeDocumentService.getDropdowns(signal)
        ])
        
        if (signal?.aborted) return
        
        setCounts(countsData)
        setDocuments(docsList)
        setCategories(dropdowns.employee_document_types)
      } else {
        const [countsData, docsList, dropdowns] = await Promise.all([
          companyDocumentService.getStatusCounts(signal),
          companyDocumentService.getAll({
            search: searchParam,
            document_type: docTypeParam,
            status: statusParam
          }, signal),
          companyDocumentService.getDropdowns(signal)
        ])
        
        if (signal?.aborted) return
        
        setCounts(countsData)
        setDocuments(docsList)
        setCategories(dropdowns.company_document_types)
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Failed to load documents data:', error)
      toast.error('Failed to retrieve documents')
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  // Load new dataset whenever URL parameters change, incorporating AbortController
  useEffect(() => {
    // Proactively clear counts & documents to prevent showing stale values from previous tab
    setCounts({ valid: 0, expiring_soon: 0, expired: 0 })
    setDocuments([])
    
    const controller = new AbortController()
    loadData(controller.signal)
    
    return () => {
      controller.abort()
    }
  }, [tab, statusFilter, categoryFilter, urlSearchQuery])

  // Reset category and status filters when changing tabs
  const handleTabChange = (newTab: string) => {
    setCategories([]) // clear categories immediately
    const nextParams = new URLSearchParams()
    nextParams.set('tab', newTab)
    router.replace(`${pathname}?${nextParams.toString()}`)
    setLocalSearch('')
  }

  const handleExport = () => {
    toast.success(`Exporting ${tab === 'employee' ? 'Employee' : 'Company'} documents...`)
  }

  const tabTriggerClass = "gap-2 rounded-lg py-2 px-3.5 text-sm font-medium text-slate-400 hover:text-slate-200 data-[state=active]:bg-violet-core/15 data-[state=active]:text-violet-glow data-[state=active]:border-violet-core/30 border border-transparent transition-all duration-300 shadow-[0_0_12px_rgba(139,92,246,0.08)] cursor-pointer shrink-0"

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-midnight/60 border border-border/40 p-1.5 rounded-xl h-auto gap-1 flex w-full overflow-x-auto scrollbar-none justify-start select-none">
          <TabsTrigger value="employee" className={tabTriggerClass}>
            Employee Documents
          </TabsTrigger>
          <TabsTrigger value="company" className={tabTriggerClass}>
            Company Documents
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Toolbar component */}
      <DocumentsToolbar
        tab={tab}
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        statusFilter={statusFilter}
        onStatusChange={(val) => updateQueryParams({ status: val })}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => updateQueryParams({ category: val })}
        categories={categories}
        onExport={handleExport}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      {/* Summary status counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = key === 'valid' ? counts.valid
            : key === 'expiring' ? counts.expiring_soon
            : counts.expired;
          const Icon = config.icon
          return (
            <div key={key} className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-medium">{config.label}</p>
                {loading ? (
                  <Skeleton className="h-8 w-12 rounded mt-1 bg-midnight/60" />
                ) : (
                  <p className="text-2xl font-bold text-cloud font-mono">{count}</p>
                )}
              </div>
              <div className={cn('p-2.5 rounded-xl', config.className)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Document Grid Container */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-card border border-border/80 rounded-2xl p-5 border-l-2 border-l-border/40 space-y-4 shadow-lg">
              <div className="flex items-start justify-between">
                <Skeleton className="w-10 h-10 rounded-xl bg-midnight/60" />
                <Skeleton className="w-16 h-5 rounded-full bg-midnight/60" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded bg-midnight/60" />
                <Skeleton className="h-3.5 w-1/2 rounded bg-midnight/60" />
              </div>
              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <Skeleton className="h-3 w-12 rounded bg-midnight/60" />
                <Skeleton className="h-3 w-20 rounded bg-midnight/60" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              type={tab}
              index={idx}
              onDeleteSuccess={() => loadData()}
            />
          ))}
        </div>
      ) : (
        /* Empty State Card */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-card border border-border/60 rounded-2xl py-16">
          <div className="w-12 h-12 bg-midnight/80 border border-border rounded-xl flex items-center justify-center mb-4">
            <FileQuestion className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-sm font-semibold text-cloud mb-1">No documents matching your search</h3>
          <p className="text-xs text-muted-foreground max-w-[280px] mb-4">
            Try adjusting your search query, status filters, or document type criteria.
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              updateQueryParams({ status: 'all', category: 'all', search: '' })
              setLocalSearch('')
            }}
            className="text-xs rounded-xl h-9"
          >
            Clear Filters
          </Button>
        </div>
      )}
      {/* Upload Dialog Modal */}
      <UploadDocumentModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        tab={tab}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
