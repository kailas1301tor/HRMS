// app/settings/page.tsx
import { Suspense } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { SettingsPanel } from "@/components/settings/settings-panel"

export default function SettingsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-96 w-full rounded-2xl bg-midnight/50 animate-pulse" />}>
        <SettingsPanel />
      </Suspense>
    </AppShell>
  )
}

export const metadata = {
  title: "Settings | HRMS",
  description: "Manage your organization, users, and system preferences",
}
