import { Suspense } from 'react'
import { DashboardHeader } from '@/components/admin/dashboard-header'
import { StatsCards } from '@/components/admin/stats-cards'
import { ActionCards } from '@/components/admin/action-cards'
import { MagicUIProvider } from '@/lib/magic-ui'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4 animate-fade-in">
        <MagicUIProvider>
          <Suspense fallback={<div className="h-20 bg-gray-200 rounded animate-pulse" />}>
            <DashboardHeader />
          </Suspense>
          
          <Suspense fallback={<div className="h-32 bg-gray-200 rounded animate-pulse mb-8" />}>
            <StatsCards />
          </Suspense>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Acciones Rápidas
            </h2>
            <p className="text-muted-foreground mb-6">
              Accede a las principales funciones administrativas del sistema
            </p>
            <Suspense fallback={<div className="h-64 bg-gray-200 rounded animate-pulse" />}>
              <ActionCards />
            </Suspense>
          </div>
        </MagicUIProvider>
      </div>
    </div>
  )
}