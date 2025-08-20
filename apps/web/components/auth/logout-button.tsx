'use client'

import { useState } from 'react'
import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await signOut()
    window.location.href = '/login'
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-falabella-red text-falabella-red hover:bg-falabella-red hover:text-white"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saliendo...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </>
      )}
    </Button>
  )
}