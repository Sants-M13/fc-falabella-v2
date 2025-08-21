import { z } from 'zod';

export const skuSchema = z
  .string()
  .min(1, 'El SKU es requerido')
  .max(50, 'El SKU no puede exceder 50 caracteres')
  .regex(/^[A-Za-z0-9]+$/, 'El SKU solo puede contener letras y números');

export const createProductSchema = z.object({
  sku_parent: skuSchema,
  brand: z
    .string()
    .min(1, 'La marca es requerida')
    .max(100, 'La marca no puede exceder 100 caracteres'),
  style: z
    .string()
    .min(1, 'El estilo es requerido')
    .max(100, 'El estilo no puede exceder 100 caracteres'),
  price: z
    .number()
    .positive('El precio debe ser mayor que 0')
    .multipleOf(0.01, 'El precio debe tener máximo 2 decimales'),
  cost: z
    .number()
    .positive('El costo debe ser mayor que 0')
    .multipleOf(0.01, 'El costo debe tener máximo 2 decimales'),
});

export const updateProductSchema = z.object({
  sku_parent: skuSchema.optional(),
  brand: z
    .string()
    .min(1, 'La marca es requerida')
    .max(100, 'La marca no puede exceder 100 caracteres')
    .optional(),
  style: z
    .string()
    .min(1, 'El estilo es requerido')
    .max(100, 'El estilo no puede exceder 100 caracteres')
    .optional(),
  price: z
    .number()
    .positive('El precio debe ser mayor que 0')
    .multipleOf(0.01, 'El precio debe tener máximo 2 decimales')
    .optional(),
  cost: z
    .number()
    .positive('El costo debe ser mayor que 0')
    .multipleOf(0.01, 'El costo debe tener máximo 2 decimales')
    .optional(),
});

export const createVariantSchema = z.object({
  product_id: z.string().uuid('ID de producto inválido'),
  sku_child: skuSchema,
  size: z
    .string()
    .min(1, 'El tamaño es requerido')
    .max(50, 'El tamaño no puede exceder 50 caracteres'),
});

export const updateVariantSchema = z.object({
  sku_child: skuSchema.optional(),
  size: z
    .string()
    .min(1, 'El tamaño es requerido')
    .max(50, 'El tamaño no puede exceder 50 caracteres')
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;