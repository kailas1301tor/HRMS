// components/employees/profile/activity-tab.tsx
'use client'

import { EmptyTabState } from './empty-tab-state'

export function ActivityTab() {
  return (
    <EmptyTabState
      title="No Activity Logs"
      description="There are currently no audit trail, edit history, or status change actions recorded for this employee."
    />
  )
}
