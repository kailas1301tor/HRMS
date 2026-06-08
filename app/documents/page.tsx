import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { DocumentsGrid } from '@/components/documents/documents-grid'

export default function DocumentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Documents</h1>
          <p className="text-muted-foreground">
            Manage employee documents and track expiry dates
          </p>
        </div>

        {/* Documents Grid */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-card border border-border/60 rounded-2xl">
            <span className="text-sm text-slate-400 font-medium">Loading documents interface...</span>
          </div>
        }>
          <DocumentsGrid />
        </Suspense>
      </div>
    </AppShell>
  )
}

