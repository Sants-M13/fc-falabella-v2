'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StoreForm } from './store-form'
import type { Store } from '@/../../packages/types'

interface StoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store?: Store | null
  mode: 'create' | 'edit'
  onSuccess?: (store: Store) => void
}

export function StoreDialog({ 
  open, 
  onOpenChange, 
  store, 
  mode,
  onSuccess 
}: StoreDialogProps) {
  const handleSuccess = (newStore: Store) => {
    onSuccess?.(newStore)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nueva Tienda' : 'Editar Tienda'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <StoreForm
            store={store}
            mode={mode}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}