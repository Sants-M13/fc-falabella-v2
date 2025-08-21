'use client'

import { useState, useEffect } from 'react'
import { Trash2, AlertTriangle, Loader2, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { StoreService } from '@/lib/stores'
import { useToast } from '@/hooks/use-toast'
import type { Store } from '@/../../packages/types'

interface DeleteStoreDialogProps {
  store: Store | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteStoreDialog({ 
  store, 
  open, 
  onOpenChange, 
  onSuccess 
}: DeleteStoreDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCheckingDependencies, setIsCheckingDependencies] = useState(false)
  const [dependencies, setDependencies] = useState<{
    hasProfiles: boolean
    profileCount: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { toast } = useToast()

  useEffect(() => {
    if (open && store) {
      checkDependencies()
    } else {
      setDependencies(null)
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, store])

  const checkDependencies = async () => {
    if (!store) return
    
    try {
      setIsCheckingDependencies(true)
      setError(null)
      
      const deps = await StoreService.checkStoreDependencies(store.id)
      setDependencies(deps)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar dependencias'
      setError(errorMessage)
    } finally {
      setIsCheckingDependencies(false)
    }
  }

  const handleDelete = async () => {
    if (!store) return
    
    try {
      setIsDeleting(true)
      
      await StoreService.deleteStore(store.id)
      
      toast({
        title: '¡Tienda eliminada!',
        description: `La tienda "${store.name}" ha sido eliminada correctamente`,
        variant: 'default'
      })
      
      onSuccess?.()
      onOpenChange(false)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tienda'
      toast({
        title: 'Error al eliminar',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  if (!store) return null

  const hasBlockingDependencies = dependencies?.hasProfiles

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Eliminar Tienda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Store Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900">{store.name}</h4>
            <div className="flex gap-2 mt-1 text-sm text-gray-600">
              <Badge variant="outline">ID: {store.id.slice(-8)}</Badge>
              <Badge variant="outline">SKUs: {store.max_skus.toLocaleString('es-CO')}</Badge>
            </div>
          </div>

          {/* Loading Dependencies */}
          {isCheckingDependencies && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando dependencias...
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Dependencies Found */}
          {dependencies && dependencies.hasProfiles && (
            <Alert variant="destructive">
              <Users className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">⚠️ No se puede eliminar esta tienda</p>
                  <p>
                    Esta tienda tiene <strong>{dependencies.profileCount}</strong> {' '}
                    {dependencies.profileCount === 1 ? 'usuario asociado' : 'usuarios asociados'}.
                  </p>
                  <p className="text-sm">
                    Para eliminar esta tienda, primero debe reasignar o eliminar 
                    todos los usuarios asociados.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Safe to Delete */}
          {dependencies && !dependencies.hasProfiles && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Esta acción no se puede deshacer</p>
                  <p>
                    La tienda &ldquo;{store.name}&rdquo; será eliminada permanentemente del sistema.
                  </p>
                  <p className="text-sm text-gray-600">
                    ✅ No se encontraron usuarios asociados a esta tienda.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Confirmation Message */}
          {dependencies && !hasBlockingDependencies && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                ¿Está seguro que desea eliminar la tienda <strong>&ldquo;{store.name}&rdquo;</strong>?
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isDeleting}
            className="sm:order-1"
          >
            Cancelar
          </Button>
          
          {dependencies && !hasBlockingDependencies && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isCheckingDependencies}
              className="sm:order-2"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? 'Eliminando...' : 'Eliminar Tienda'}
            </Button>
          )}
          
          {hasBlockingDependencies && (
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="sm:order-2"
            >
              Entendido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}