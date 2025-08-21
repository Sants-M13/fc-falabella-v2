'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { StoreService } from '@/lib/stores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StoreDialog } from '@/components/admin/stores/store-dialog'
import { DeleteStoreDialog } from '@/components/admin/stores/delete-store-dialog'
import type { Store } from '@/../../packages/types'

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null)
  
  const queryClient = useQueryClient()

  const { 
    data: stores = [], 
    isLoading, 
    error
  } = useQuery({
    queryKey: ['stores'],
    queryFn: () => StoreService.getAllStores(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateStore = () => {
    setSelectedStore(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleEditStore = (store: Store) => {
    setSelectedStore(store)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleStoreSuccess = () => {
    // Refrescar la lista de stores
    queryClient.invalidateQueries({ queryKey: ['stores'] })
  }

  const handleDeleteStore = (store: Store) => {
    setStoreToDelete(store)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = () => {
    // Refrescar la lista después de eliminar
    queryClient.invalidateQueries({ queryKey: ['stores'] })
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar las tiendas. Por favor, intenta de nuevo.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gestión de Tiendas
          </h1>
          <p className="text-gray-600">
            Administra las tiendas y sus límites de capacidad
          </p>
        </div>
        <Button onClick={handleCreateStore}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tienda
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar tiendas por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Store Cards - Mobile First */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onEdit={() => handleEditStore(store)}
              onDelete={() => handleDeleteStore(store)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredStores.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron tiendas' : 'No hay tiendas registradas'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No hay tiendas que coincidan con "${searchTerm}"`
                : 'Comienza creando tu primera tienda para gestionar el inventario'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateStore}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Tienda
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Store Dialog */}
      <StoreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        store={selectedStore}
        mode={dialogMode}
        onSuccess={handleStoreSuccess}
      />

      {/* Delete Dialog */}
      <DeleteStoreDialog
        store={storeToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

interface StoreCardProps {
  store: Store
  onEdit: () => void
  onDelete: () => void
}

function StoreCard({ store, onEdit, onDelete }: StoreCardProps) {
  // Calcular porcentajes de utilización (mock data por ahora)
  const utilizationMock = {
    skus: Math.floor(Math.random() * store.max_skus),
    brands: Math.floor(Math.random() * store.max_brands),
    inventory: Math.floor(Math.random() * store.max_inventory)
  }

  const getUtilizationStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return 'critical'
    if (percentage >= 75) return 'warning'
    return 'normal'
  }


  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {store.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            ID: {store.id.slice(-8)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SKUs */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">SKUs</span>
            <span className="font-medium">
              {utilizationMock.skus.toLocaleString('es-CO')} / {store.max_skus.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                getUtilizationStatus(utilizationMock.skus, store.max_skus) === 'critical' 
                  ? 'bg-red-500'
                  : getUtilizationStatus(utilizationMock.skus, store.max_skus) === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${(utilizationMock.skus / store.max_skus) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Marcas */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Marcas</span>
            <span className="font-medium">
              {utilizationMock.brands.toLocaleString('es-CO')} / {store.max_brands.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                getUtilizationStatus(utilizationMock.brands, store.max_brands) === 'critical'
                  ? 'bg-red-500'
                  : getUtilizationStatus(utilizationMock.brands, store.max_brands) === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${(utilizationMock.brands / store.max_brands) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Inventario */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Inventario</span>
            <span className="font-medium">
              {utilizationMock.inventory.toLocaleString('es-CO')} / {store.max_inventory.toLocaleString('es-CO')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                getUtilizationStatus(utilizationMock.inventory, store.max_inventory) === 'critical'
                  ? 'bg-red-500'
                  : getUtilizationStatus(utilizationMock.inventory, store.max_inventory) === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${(utilizationMock.inventory / store.max_inventory) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onEdit}
          >
            <Edit className="mr-1 h-3 w-3" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}