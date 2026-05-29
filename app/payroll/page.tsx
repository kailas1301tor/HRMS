import { AppShell } from '@/components/layout/app-shell'
import { PayrollDashboard } from '@/components/payroll/payroll-dashboard'

export default function PayrollPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Payroll</h1>
          <p className="text-muted-foreground">
            Manage employee salaries and WPS processing
          </p>
        </div>

        {/* Payroll Dashboard */}
        <PayrollDashboard />
      </div>
    </AppShell>
  )
}
