'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductTable } from '@/components/admin/products/product-table';
import { ProductForm } from '@/components/admin/products/product-form';
import { DeleteProductDialog } from '@/components/admin/products/delete-product-dialog';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { getProducts } from '@/lib/actions/products';
import { ProductWithVariants, ProductFilters } from '@/lib/types/products';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('created_at');
  const [sortOrder, setSortOrder] = useState<ProductFilters['sortOrder']>('desc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithVariants | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithVariants | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });


  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.sku_parent.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.style.toLowerCase().includes(searchLower) ||
        product.variants.some(v => 
          v.sku_child.toLowerCase().includes(searchLower) ||
          v.size.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy!] || '';
      const bValue = b[sortBy!] || '';
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast({
      title: '¡Éxito!',
      description: 'Producto creado exitosamente',
    });
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast({
      title: '¡Éxito!',
      description: 'Producto actualizado exitosamente',
    });
  };

  const handleDelete = (product: ProductWithVariants) => {
    setDeletingProduct(product);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error al cargar productos: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Panel', href: '/admin' },
    { label: 'Gestión de Productos', current: true },
  ];

  const totalVariants = products.reduce((sum, product) => sum + product.variants.length, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-muted-foreground">
            Administra el catálogo de productos y sus variantes
          </p>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo producto y sus variantes.
              </DialogDescription>
            </DialogHeader>
            <ProductForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variantes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVariants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcas Únicas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(products.map(p => p.brand)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por SKU, marca, estilo o tamaño..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as ProductFilters['sortBy'])}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sku_parent">SKU Padre</SelectItem>
                  <SelectItem value="brand">Marca</SelectItem>
                  <SelectItem value="style">Estilo</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                  <SelectItem value="created_at">Fecha</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as ProductFilters['sortOrder'])}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Actualice los datos del producto y sus variantes.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <DeleteProductDialog
        product={deletingProduct}
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      />
    </div>
  );
}