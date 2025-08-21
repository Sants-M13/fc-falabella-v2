"use client"

import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BorderBeam, ShimmerButton } from '@/lib/magic-ui'
import { 
  Store, 
  Users, 
  Package, 
  Settings, 
  BarChart3, 
  FileText,
  ArrowRight 
} from 'lucide-react'

const actions = [
  {
    title: "Gestionar Tiendas",
    description: "Administrar ubicaciones y configuraciones de tiendas",
    icon: Store,
    href: "/admin/stores",
    highlight: true
  },
  {
    title: "Control de Usuarios",
    description: "Gestionar promotoras y permisos de acceso",
    icon: Users,
    href: "/admin/users"
  },
  {
    title: "Inventario",
    description: "Supervisar productos y stock en tiempo real",
    icon: Package,
    href: "/admin/inventario"
  },
  {
    title: "Configuración",
    description: "Ajustes del sistema y preferencias",
    icon: Settings,
    href: "/admin/configuracion"
  },
  {
    title: "Reportes",
    description: "Análisis y métricas de rendimiento",
    icon: BarChart3,
    href: "/admin/reportes"
  },
  {
    title: "Documentación",
    description: "Guías y documentación del sistema",
    icon: FileText,
    href: "/admin/docs"
  }
]

export function ActionCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, index) => (
        <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-none">
          {action.highlight && (
            <Suspense fallback={<div className="absolute inset-0 rounded-lg border-2 border-falabella-red opacity-20" />}>
              <BorderBeam size={250} duration={12} delay={9} />
            </Suspense>
          )}
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${action.highlight ? 'bg-falabella-red/10 text-falabella-red' : 'bg-muted text-muted-foreground'}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {action.highlight ? (
              <Suspense fallback={
                <Link href={action.href}>
                  <Button className="w-full bg-falabella-red hover:bg-falabella-darkRed">
                    Acceder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              }>
                <Link href={action.href}>
                  <ShimmerButton className="w-full bg-falabella-red hover:bg-falabella-darkRed">
                    <span className="flex items-center justify-center">
                      Acceder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </ShimmerButton>
                </Link>
              </Suspense>
            ) : (
              <Link href={action.href}>
                <Button variant="outline" className="w-full group-hover:bg-muted">
                  Acceder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}