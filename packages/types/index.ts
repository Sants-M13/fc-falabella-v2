export type UserRole = 'admin' | 'promotora';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  max_skus: number;
  max_brands: number;
  max_inventory: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface StoreInput {
  name: string;
  max_skus?: number;
  max_brands?: number;
  max_inventory?: number;
}

export interface StoreUpdate {
  name?: string;
  max_skus?: number;
  max_brands?: number;
  max_inventory?: number;
}