import { Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';

export type Product = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

export type Variant = Tables<'variants'>;
export type VariantInsert = TablesInsert<'variants'>;
export type VariantUpdate = TablesUpdate<'variants'>;

export interface ProductWithVariants extends Product {
  variants: Variant[];
}

export interface ProductFormData {
  sku_parent: string;
  brand: string;
  style: string;
  price: number;
  cost: number;
  variants?: VariantFormData[];
}

export interface VariantFormData {
  id?: string;
  sku_child: string;
  size: string;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  sku?: string;
  sortBy?: 'sku_parent' | 'brand' | 'style' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}