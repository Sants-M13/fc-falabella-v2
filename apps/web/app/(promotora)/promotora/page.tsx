import { MobileHeader } from '@/components/shared/mobile-header'
import { QuickActions } from '@/components/shared/quick-actions'
import { MobileStats } from '@/components/shared/mobile-stats'

export default function PromotoraPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first header */}
      <MobileHeader 
        title="Panel de Promotora" 
        subtitle="Gestiona tu tienda de forma rápida y eficiente"
      />
      
      {/* Quick actions - prioridad en mobile */}
      <QuickActions />
      
      {/* Stats section */}
      <MobileStats />
      
      {/* Bottom safe area for mobile */}
      <div className="h-6"></div>
    </div>
  )
}