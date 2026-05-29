// components/employees/profile/attendance-tab.tsx
'use client'

import { EmptyTabState } from './empty-tab-state'

export function AttendanceTab() {
  return (
    <EmptyTabState
      title="No Attendance Logs"
      description="There are currently no attendance, clock-in, or work-hour logging records for this employee."
    />
  )
}
