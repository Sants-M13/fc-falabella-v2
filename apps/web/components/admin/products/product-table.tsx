'use client';

import { ProductWithVariants } from '@/lib/types/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, Tag } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProductTableProps {
  products: ProductWithVariants[];
  onEdit: (product: ProductWithVariants) => void;
  onDelete: (product: ProductWithVariants) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const toggleExpanded = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">No hay productos</p>
        <p className="text-sm text-gray-500 mt-1">
          Comience creando un nuevo producto
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU Padre</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Estilo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Variantes</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono font-medium">
                  {product.sku_parent}
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.style}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatCurrency(product.cost)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(product.created_at!)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      title="Editar producto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product)}
                      title="Eliminar producto"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        {products.map((product) => {
          const isExpanded = expandedProducts.has(product.id);
          
          return (
            <Collapsible key={product.id}>
              <div className="p-4 border-b last:border-b-0">
                {/* Product Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-medium text-sm bg-gray-100 px-2 py-1 rounded">
                        {product.sku_parent}
                      </code>
                      <Badge variant="outline" className="font-mono text-xs">
                        {product.variants.length}
                      </Badge>
                    </div>
                    <p className="font-medium">{product.brand} - {product.style}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="font-medium">{formatCurrency(product.price)}</span>
                      <span className="text-muted-foreground">Costo: {formatCurrency(product.cost)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      title="Editar producto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product)}
                      title="Eliminar producto"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Variants Toggle */}
                {product.variants.length > 0 && (
                  <CollapsibleTrigger
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => toggleExpanded(product.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    Ver {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}
                  </CollapsibleTrigger>
                )}

                {/* Variants List */}
                <CollapsibleContent className="mt-3">
                  <div className="pl-6 space-y-2 border-l-2 border-gray-100">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <code className="font-mono text-xs bg-blue-50 px-2 py-1 rounded">
                            {variant.sku_child}
                          </code>
                          <span className="text-sm">{variant.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>

                {/* Date */}
                <div className="text-xs text-muted-foreground mt-2">
                  Creado {formatDateTime(product.created_at!)}
                </div>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}