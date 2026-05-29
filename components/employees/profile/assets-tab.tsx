// components/employees/profile/assets-tab.tsx
'use client'

import { EmptyTabState } from './empty-tab-state'

export function AssetsTab() {
  return (
    <EmptyTabState
      title="No Assigned Assets"
      description="There are currently no hardware or software assets assigned to this employee."
    />
  )
}
