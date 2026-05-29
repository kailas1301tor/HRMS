import { AppShell } from '@/components/layout/app-shell'
import { AttendanceSheet } from '@/components/attendance/attendance-sheet'

export default function AttendancePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage daily employee attendance
          </p>
        </div>

        {/* Attendance Sheet */}
        <AttendanceSheet />
      </div>
    </AppShell>
  )
}
