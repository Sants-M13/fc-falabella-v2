"use client"

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NumberTicker } from '@/lib/magic-ui'
import { Store, Users, Package, TrendingUp } from 'lucide-react'

const statsData = [
  {
    title: "Tiendas Activas",
    value: 247,
    icon: Store,
    trend: "+12%",
    description: "vs. mes anterior",
    color: "text-falabella-red"
  },
  {
    title: "Promotoras",
    value: 1834,
    icon: Users,
    trend: "+5%",
    description: "usuarios activos",
    color: "text-falabella-blue"
  },
  {
    title: "Productos",
    value: 15420,
    icon: Package,
    trend: "+8%",
    description: "en inventario",
    color: "text-falabella-green"
  },
  {
    title: "Ventas",
    value: 98745,
    icon: TrendingUp,
    trend: "+15%",
    description: "este mes",
    color: "text-orange-500"
  }
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Suspense fallback={stat.value.toLocaleString('es-CO')}>
                <NumberTicker value={stat.value} />
              </Suspense>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Badge variant="secondary" className={`${stat.color} bg-opacity-10`}>
                {stat.trend}
              </Badge>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}