// app/employees/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { EmployeeTable } from '@/components/employees/employee-table'

export default function EmployeesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Employees</h1>
          <p className="text-muted-foreground">
            Manage your workforce and employee information
          </p>
        </div>

        {/* Employee Table */}
        <Suspense fallback={<div className="h-96 w-full rounded-2xl bg-carbon/50 skeleton-shimmer" />}>
          <EmployeeTable />
        </Suspense>
      </div>
    </AppShell>
  )
}
