"use client"

import { LogoutButton } from '@/components/auth/logout-button'

interface MobileHeaderProps {
  title: string
  subtitle?: string
}

export function MobileHeader({ title, subtitle }: MobileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}