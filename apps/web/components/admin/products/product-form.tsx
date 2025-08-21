'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createProductSchema, CreateProductInput } from '@/lib/validations/products';
import { createProductAction, updateProductAction, checkSkuUniquenessAction } from '@/lib/actions/products';
import { ProductWithVariants } from '@/lib/types/products';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

const productFormSchema = createProductSchema.extend({
  variants: z.array(
    z.object({
      id: z.string().optional(),
      sku_child: z
        .string()
        .min(1, 'El SKU hijo es requerido')
        .max(50, 'El SKU no puede exceder 50 caracteres')
        .regex(/^[A-Za-z0-9]+$/, 'El SKU solo puede contener letras y números'),
      size: z
        .string()
        .min(1, 'El tamaño es requerido')
        .max(50, 'El tamaño no puede exceder 50 caracteres'),
    })
  ).optional(),
});

type ProductFormInput = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: ProductWithVariants;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!product;
  const { toast } = useToast();

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEdit ? {
      sku_parent: product.sku_parent,
      brand: product.brand,
      style: product.style,
      price: product.price,
      cost: product.cost,
      variants: product.variants.map(v => ({
        id: v.id,
        sku_child: v.sku_child,
        size: v.size,
      })),
    } : {
      sku_parent: '',
      brand: '',
      style: '',
      price: 0,
      cost: 0,
      variants: [],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const createMutation = useMutation({
    mutationFn: createProductAction,
    onSuccess: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear producto',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProductInput }) =>
      updateProductAction(id, data),
    onSuccess: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar producto',
        variant: 'destructive',
      });
    },
  });

  const addVariant = () => {
    appendVariant({
      sku_child: '',
      size: '',
    });
  };

  const onSubmit = async (data: ProductFormInput) => {
    setIsSubmitting(true);

    // Check SKU uniqueness for parent
    try {
      const isParentSkuUnique = await checkSkuUniquenessAction(
        data.sku_parent, 
        'parent', 
        product?.id
      );
      if (!isParentSkuUnique) {
        form.setError('sku_parent', {
          type: 'manual',
          message: 'Este SKU padre ya existe',
        });
        setIsSubmitting(false);
        return;
      }

      // Check SKU uniqueness for variants
      if (data.variants) {
        for (let i = 0; i < data.variants.length; i++) {
          const variant = data.variants[i];
          const isChildSkuUnique = await checkSkuUniquenessAction(
            variant.sku_child,
            'child',
            variant.id
          );
          if (!isChildSkuUnique) {
            form.setError(`variants.${i}.sku_child`, {
              type: 'manual',
              message: 'Este SKU hijo ya existe',
            });
            setIsSubmitting(false);
            return;
          }
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al verificar unicidad de SKU',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission including variants
    const productData = {
      sku_parent: data.sku_parent,
      brand: data.brand,
      style: data.style,
      price: data.price,
      cost: data.cost,
      variants: data.variants?.filter(v => v.sku_child && v.size) || [],
    };

    if (isEdit && product) {
      updateMutation.mutate({ id: product.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SKU Parent */}
            <FormField
              control={form.control}
              name="sku_parent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU Padre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC123"
                      {...field}
                      className="font-mono"
                      aria-describedby={
                        form.formState.errors.sku_parent ? `${field.name}-error` : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage id={`${field.name}-error`} />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nike"
                        {...field}
                        aria-describedby={
                          form.formState.errors.brand ? `${field.name}-error` : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-error`} />
                  </FormItem>
                )}
              />

              {/* Style */}
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Air Max"
                        {...field}
                        aria-describedby={
                          form.formState.errors.style ? `${field.name}-error` : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-error`} />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (COP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="150000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        aria-describedby={
                          form.formState.errors.price ? `${field.name}-error` : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-error`} />
                  </FormItem>
                )}
              />

              {/* Cost */}
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo (COP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="100000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        aria-describedby={
                          form.formState.errors.cost ? `${field.name}-error` : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-error`} />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Variants Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Variantes del Producto</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Variante
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variantFields.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay variantes agregadas. Use el botón &quot;Agregar Variante&quot; para añadir tamaños.
              </p>
            ) : (
              variantFields.map((field, index) => (
                <Card key={field.id} className="border-dashed">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Variante {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SKU Child */}
                      <FormField
                        control={form.control}
                        name={`variants.${index}.sku_child`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU Hijo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ABC123-M"
                                {...field}
                                className="font-mono"
                                aria-describedby={
                                  form.formState.errors.variants?.[index]?.sku_child 
                                    ? `${field.name}-error` 
                                    : undefined
                                }
                              />
                            </FormControl>
                            <FormMessage id={`${field.name}-error`} />
                          </FormItem>
                        )}
                      />

                      {/* Size */}
                      <FormField
                        control={form.control}
                        name={`variants.${index}.size`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tamaño</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="M, L, XL, 38, 40..."
                                {...field}
                                aria-describedby={
                                  form.formState.errors.variants?.[index]?.size 
                                    ? `${field.name}-error` 
                                    : undefined
                                }
                              />
                            </FormControl>
                            <FormMessage id={`${field.name}-error`} />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              isEdit ? 'Actualizar Producto' : 'Crear Producto'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}