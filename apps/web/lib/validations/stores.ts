import { z } from 'zod'

export const storeCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  max_skus: z
    .number()
    .min(1, 'Debe permitir al menos 1 SKU')
    .max(10000, 'El límite de SKUs no puede exceder 10,000')
    .default(1000),
  
  max_brands: z
    .number()
    .min(1, 'Debe permitir al menos 1 marca')
    .max(500, 'El límite de marcas no puede exceder 500')
    .default(50),
  
  max_inventory: z
    .number()
    .min(1, 'El inventario mínimo debe ser 1')
    .max(100000, 'El límite de inventario no puede exceder 100,000')
    .default(10000)
})

export const storeUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  
  max_skus: z
    .number()
    .min(1, 'Debe permitir al menos 1 SKU')
    .max(10000, 'El límite de SKUs no puede exceder 10,000')
    .optional(),
  
  max_brands: z
    .number()
    .min(1, 'Debe permitir al menos 1 marca')
    .max(500, 'El límite de marcas no puede exceder 500')
    .optional(),
  
  max_inventory: z
    .number()
    .min(1, 'El inventario mínimo debe ser 1')
    .max(100000, 'El límite de inventario no puede exceder 100,000')
    .optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  'Al menos un campo debe ser actualizado'
)

// Schema para formularios con transformación de tipos
export const storeFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  max_skus: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 10000, {
      message: 'SKUs debe ser un número entre 1 y 10,000'
    }),
  
  max_brands: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 500, {
      message: 'Marcas debe ser un número entre 1 y 500'
    }),
  
  max_inventory: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100000, {
      message: 'Inventario debe ser un número entre 1 y 100,000'
    })
})

export type StoreCreateData = z.infer<typeof storeCreateSchema>
export type StoreUpdateData = z.infer<typeof storeUpdateSchema>
export type StoreFormData = z.infer<typeof storeFormSchema>

// Type for form inputs (before transformation)
export type StoreFormInput = {
  name: string
  max_skus: string
  max_brands: string
  max_inventory: string
}