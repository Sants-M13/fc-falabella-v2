"use client"

import { Suspense } from 'react'
import { LogoutButton } from '@/components/auth/logout-button'
import { GradientText } from '@/lib/magic-ui'

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <Suspense fallback={<h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>}>
          <GradientText className="text-4xl font-bold bg-gradient-to-r from-falabella-red to-falabella-darkRed">
            Panel de Administración
          </GradientText>
        </Suspense>
        <p className="text-muted-foreground">
          Gestiona tiendas, usuarios y configuraciones del sistema
        </p>
      </div>
      <LogoutButton />
    </div>
  )
}