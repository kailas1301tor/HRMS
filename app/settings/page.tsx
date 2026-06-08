// app/settings/page.tsx
import { Suspense } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsPage() {
  return (
    <AppShell>
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
        <SettingsPanel />
      </Suspense>
    </AppShell>
  )
}

export const metadata = {
  title: "Settings | HRMS",
  description: "Manage your organization, users, and system preferences",
}
