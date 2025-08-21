'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Package, Tag } from 'lucide-react';
import { deleteProductAction } from '@/lib/actions/products';
import { ProductWithVariants } from '@/lib/types/products';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface DeleteProductDialogProps {
  product: ProductWithVariants | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteProductAction,
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onOpenChange(false);
      toast({
        title: '¡Éxito!',
        description: 'Producto eliminado exitosamente',
      });
    },
    onError: (error) => {
      setIsDeleting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar producto',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    if (!product) return;
    setIsDeleting(true);
    deleteMutation.mutate(product.id);
  };

  if (!product) return null;

  const hasVariants = product.variants.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div>
              ¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.
            </div>
            
            {/* Product Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{product.brand} - {product.style}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <code className="font-mono text-sm bg-white px-2 py-1 rounded">
                  {product.sku_parent}
                </code>
              </div>
              <div className="flex gap-4 text-sm">
                <span>Precio: {formatCurrency(product.price)}</span>
                <span>Costo: {formatCurrency(product.cost)}</span>
              </div>
            </div>

            {/* Variants Warning */}
            {hasVariants && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">
                      Este producto tiene {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''} que también se eliminarán:
                    </p>
                    <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="font-mono">
                            {variant.sku_child}
                          </Badge>
                          <span>{variant.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              'Eliminar Producto'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}