// components/employees/profile/documents-tab.tsx
'use client'

import { EmptyTabState } from './empty-tab-state'

export function DocumentsTab() {
  return (
    <EmptyTabState
      title="No Documents Found"
      description="There are currently no compliance, visa, passport, or registration documents uploaded for this employee."
    />
  )
}
