// components/employees/profile/leave-tab.tsx
'use client'

import { EmptyTabState } from './empty-tab-state'

export function LeaveTab() {
  return (
    <EmptyTabState
      title="No Leave Records"
      description="There are currently no annual, sick, or casual leave balance records found for this employee."
    />
  )
}
