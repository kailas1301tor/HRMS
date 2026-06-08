import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { AssetsTable } from '@/components/assets/assets-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function AssetsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Assets</h1>
          <p className="text-muted-foreground">
            Track and manage company assets and equipment
          </p>
        </div>

        {/* Assets Table */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
          <AssetsTable />
        </Suspense>
      </div>
    </AppShell>
  )
}
