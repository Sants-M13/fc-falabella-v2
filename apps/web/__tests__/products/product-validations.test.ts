import { describe, it, expect } from 'vitest';
import { 
  createProductSchema, 
  updateProductSchema, 
  createVariantSchema,
  updateVariantSchema,
  skuSchema
} from '@/lib/validations/products';

describe('Product Validation Schemas', () => {
  describe('skuSchema', () => {
    it('debe aceptar SKU válido alfanumérico', () => {
      const result = skuSchema.safeParse('ABC123');
      expect(result.success).toBe(true);
      expect(result.data).toBe('ABC123');
    });

    it('debe aceptar SKU solo con letras', () => {
      const result = skuSchema.safeParse('ABCDEF');
      expect(result.success).toBe(true);
    });

    it('debe aceptar SKU solo con números', () => {
      const result = skuSchema.safeParse('123456');
      expect(result.success).toBe(true);
    });

    it('debe rechazar SKU con caracteres especiales', () => {
      const result = skuSchema.safeParse('ABC-123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El SKU solo puede contener letras y números');
      }
    });

    it('debe rechazar SKU con espacios', () => {
      const result = skuSchema.safeParse('ABC 123');
      expect(result.success).toBe(false);
    });

    it('debe rechazar SKU vacío', () => {
      const result = skuSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El SKU es requerido');
      }
    });

    it('debe rechazar SKU muy largo (>50 chars)', () => {
      const longSku = 'A'.repeat(51);
      const result = skuSchema.safeParse(longSku);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El SKU no puede exceder 50 caracteres');
      }
    });
  });

  describe('createProductSchema', () => {
    const validProduct = {
      sku_parent: 'ABC123',
      brand: 'Nike',
      style: 'Air Max',
      price: 150000.99,
      cost: 100000.50
    };

    it('debe aceptar datos válidos de producto', () => {
      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('debe rechazar precio negativo', () => {
      const invalidProduct = { ...validProduct, price: -100 };
      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El precio debe ser mayor que 0');
      }
    });

    it('debe rechazar precio cero', () => {
      const invalidProduct = { ...validProduct, price: 0 };
      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('debe rechazar costo negativo', () => {
      const invalidProduct = { ...validProduct, cost: -50 };
      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El costo debe ser mayor que 0');
      }
    });

    it('debe rechazar marca vacía', () => {
      const invalidProduct = { ...validProduct, brand: '' };
      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La marca es requerida');
      }
    });

    it('debe rechazar estilo vacío', () => {
      const invalidProduct = { ...validProduct, style: '' };
      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El estilo es requerido');
      }
    });

    it('debe rechazar precio con más de 2 decimales', () => {
      const invalidProduct = { ...validProduct, price: 150000.999 };
      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El precio debe tener máximo 2 decimales');
      }
    });
  });

  describe('createVariantSchema', () => {
    const validVariant = {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      sku_child: 'ABC123M',
      size: 'M'
    };

    it('debe aceptar datos válidos de variante', () => {
      const result = createVariantSchema.safeParse(validVariant);
      expect(result.success).toBe(true);
    });

    it('debe rechazar product_id inválido', () => {
      const invalidVariant = { ...validVariant, product_id: 'not-a-uuid' };
      const result = createVariantSchema.safeParse(invalidVariant);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID de producto inválido');
      }
    });

    it('debe rechazar tamaño vacío', () => {
      const invalidVariant = { ...validVariant, size: '' };
      const result = createVariantSchema.safeParse(invalidVariant);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El tamaño es requerido');
      }
    });

    it('debe rechazar tamaño muy largo', () => {
      const invalidVariant = { ...validVariant, size: 'X'.repeat(51) };
      const result = createVariantSchema.safeParse(invalidVariant);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El tamaño no puede exceder 50 caracteres');
      }
    });
  });

  describe('updateProductSchema', () => {
    it('debe aceptar actualización parcial válida', () => {
      const validUpdate = {
        brand: 'Adidas'
      };
      const result = updateProductSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('debe aceptar objeto vacío (sin cambios)', () => {
      const result = updateProductSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('debe rechazar precio negativo en actualización', () => {
      const invalidUpdate = {
        price: -100
      };
      const result = updateProductSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('updateVariantSchema', () => {
    it('debe aceptar actualización parcial válida', () => {
      const validUpdate = {
        size: 'L'
      };
      const result = updateVariantSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('debe aceptar objeto vacío (sin cambios)', () => {
      const result = updateVariantSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });
});