'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { StoreService } from '@/lib/stores'
import { storeFormSchema, type StoreFormInput } from '@/lib/validations/stores'
import { useToast } from '@/hooks/use-toast'
import type { Store } from '@/../../packages/types'

interface StoreFormProps {
  store?: Store | null
  onSuccess?: (store: Store) => void
  onCancel?: () => void
  mode: 'create' | 'edit'
}

export function StoreForm({ store, onSuccess, onCancel, mode }: StoreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameCheckLoading, setNameCheckLoading] = useState(false)
  const { toast } = useToast()

  const defaultValues: StoreFormInput = {
    name: store?.name || '',
    max_skus: store?.max_skus ? String(store.max_skus) : '1000',
    max_brands: store?.max_brands ? String(store.max_brands) : '50',
    max_inventory: store?.max_inventory ? String(store.max_inventory) : '10000'
  }

  const form = useForm<StoreFormInput>({
    resolver: zodResolver(storeFormSchema),
    defaultValues
  })

  // Validação de nome único
  const validateUniqueName = async (name: string): Promise<string | undefined> => {
    if (!name || name.length < 2) return undefined
    if (mode === 'edit' && store?.name === name) return undefined

    try {
      setNameCheckLoading(true)
      const isAvailable = await StoreService.isStoreNameAvailable(
        name, 
        mode === 'edit' ? store?.id : undefined
      )
      
      if (!isAvailable) {
        return 'Este nombre de tienda ya está en uso'
      }
    } catch (error) {
      console.error('Error validating name:', error)
    } finally {
      setNameCheckLoading(false)
    }
    
    return undefined
  }

  const onSubmit = async (data: StoreFormInput) => {
    try {
      setIsSubmitting(true)

      // Validação final de nome único
      const nameError = await validateUniqueName(data.name)
      if (nameError) {
        form.setError('name', { message: nameError })
        return
      }

      // The schema will transform strings to numbers
      const validatedData = storeFormSchema.parse(data)
      const storeData = {
        name: validatedData.name,
        max_skus: validatedData.max_skus,
        max_brands: validatedData.max_brands,
        max_inventory: validatedData.max_inventory
      }

      let result: Store

      if (mode === 'create') {
        result = await StoreService.createStore(storeData)
        toast({
          title: '¡Éxito!',
          description: 'Tienda creada correctamente',
          variant: 'default'
        })
      } else {
        if (!store?.id) throw new Error('ID de tienda requerido para edición')
        result = await StoreService.updateStore(store.id, storeData)
        toast({
          title: '¡Éxito!', 
          description: 'Tienda actualizada correctamente',
          variant: 'default'
        })
      }

      onSuccess?.(result)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    onCancel?.()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Nueva Tienda' : 'Editar Tienda'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre de la Tienda */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Tienda *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field}
                        placeholder="Ingrese el nombre de la tienda"
                        disabled={isSubmitting}
                        aria-describedby="name-description"
                        onBlur={async (e) => {
                          field.onBlur()
                          if (e.target.value) {
                            const error = await validateUniqueName(e.target.value)
                            if (error) {
                              form.setError('name', { message: error })
                            } else {
                              form.clearErrors('name')
                            }
                          }
                        }}
                      />
                      {nameCheckLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription id="name-description">
                    El nombre debe ser único y solo contener letras y espacios
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid para los límites */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Límite de SKUs */}
              <FormField
                control={form.control}
                name="max_skus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de SKUs *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="10000"
                        placeholder="1000"
                        disabled={isSubmitting}
                        aria-describedby="skus-description"
                      />
                    </FormControl>
                    <FormDescription id="skus-description" className="text-xs">
                      Entre 1 y 10,000
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Límite de Marcas */}
              <FormField
                control={form.control}
                name="max_brands"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de Marcas *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="500"
                        placeholder="50"
                        disabled={isSubmitting}
                        aria-describedby="brands-description"
                      />
                    </FormControl>
                    <FormDescription id="brands-description" className="text-xs">
                      Entre 1 y 500
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Límite de Inventario */}
              <FormField
                control={form.control}
                name="max_inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de Inventario *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="100000"
                        placeholder="10000"
                        disabled={isSubmitting}
                        aria-describedby="inventory-description"
                      />
                    </FormControl>
                    <FormDescription id="inventory-description" className="text-xs">
                      Entre 1 y 100,000
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información adicional */}
            <Alert>
              <AlertDescription>
                <strong>Información importante:</strong> Los límites determinan la capacidad 
                máxima de productos que puede manejar esta tienda. Pueden ser modificados 
                posteriormente según las necesidades del negocio.
              </AlertDescription>
            </Alert>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || nameCheckLoading}
                className="sm:flex-1"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Crear Tienda' : 'Actualizar Tienda'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
                className="sm:flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}