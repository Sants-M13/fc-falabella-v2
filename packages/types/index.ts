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
  maxSkus: number;
  maxBrands: number;
  maxInventory: number;
  createdAt: Date;
  updatedAt: Date;
}