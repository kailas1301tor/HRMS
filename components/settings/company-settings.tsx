// components/settings/company-settings.tsx
'use client'

import { DepartmentSettingsCard } from './department-settings-card'
import { BranchSettingsCard } from './branch-settings-card'
import { DesignationSettingsCard } from './designation-settings-card'

export function CompanySettings() {
  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Company Structure Masters</h2>
        <p className="text-xs text-slate-400 mt-1">
          Define departments, branches, and designations organizational hierarchy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentSettingsCard />
        <BranchSettingsCard />
      </div>

      <DesignationSettingsCard />
    </div>
  )
}
