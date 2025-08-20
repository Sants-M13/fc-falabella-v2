"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Scan, 
  ClipboardList, 
  BarChart3,
  Plus,
  Search
} from 'lucide-react'

const quickActions = [
  {
    title: "Escanear Producto",
    description: "Código de barras",
    icon: Scan,
    variant: "default" as const,
    urgent: true
  },
  {
    title: "Inventario",
    description: "Ver stock actual",
    icon: Package,
    variant: "outline" as const
  },
  {
    title: "Registrar Venta", 
    description: "Nueva transacción",
    icon: Plus,
    variant: "outline" as const
  },
  {
    title: "Buscar Producto",
    description: "Por nombre/código",
    icon: Search,
    variant: "outline" as const
  },
  {
    title: "Tareas Pendientes",
    description: "Lista de actividades",
    icon: ClipboardList,
    variant: "outline" as const,
    badge: "3"
  },
  {
    title: "Reportes",
    description: "Métricas diarias",
    icon: BarChart3,
    variant: "outline" as const
  }
]

export function QuickActions() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        Acciones Rápidas
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`relative hover:shadow-md transition-shadow border-none ${
              action.urgent ? 'bg-falabella-red/5 border-falabella-red/20' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-3 rounded-full ${
                  action.urgent 
                    ? 'bg-falabella-red text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm leading-tight">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
                {action.badge && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center bg-falabella-red text-white"
                  >
                    {action.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}