"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statsData = [
  {
    label: "Ventas Hoy",
    value: "12",
    currency: "$4.567.890",
    trend: "+15%",
    positive: true
  },
  {
    label: "Productos Stock",
    value: "247",
    subtext: "unidades",
    trend: "-3%",
    positive: false
  },
  {
    label: "Meta Mensual",
    value: "67%",
    subtext: "completada",
    trend: "+8%",
    positive: true
  }
]

export function MobileStats() {
  return (
    <div className="px-4 py-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        Resumen de Hoy
      </h2>
      <div className="space-y-3">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    {stat.currency && (
                      <span className="text-sm text-falabella-green font-medium">
                        {stat.currency}
                      </span>
                    )}
                    {stat.subtext && (
                      <span className="text-sm text-muted-foreground">
                        {stat.subtext}
                      </span>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${
                    stat.positive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}