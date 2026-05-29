import { AppShell } from '@/components/layout/app-shell'
import { RequestsList } from '@/components/requests/requests-list'

export default function RequestsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Requests</h1>
          <p className="text-muted-foreground">
            Review and manage employee requests and approvals
          </p>
        </div>

        {/* Requests List */}
        <RequestsList />
      </div>
    </AppShell>
  )
}
