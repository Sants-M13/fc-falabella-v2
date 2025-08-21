'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database, Tables } from '../database.types';
import { 
  CreateProductInput, 
  UpdateProductInput,
  CreateVariantInput,
  UpdateVariantInput 
} from '@/lib/validations/products';
import { ProductWithVariants } from '@/lib/types/products';
import { revalidatePath } from 'next/cache';

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

async function validateAdminAccess() {
  const supabase = await createSupabaseServerClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error('No autorizado');
  }
  
  const { data: currentProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single();
  
  if (currentProfile?.role !== 'admin') {
    throw new Error('Solo los administradores pueden gestionar productos');
  }
  
  return currentUser;
}

export async function getProducts(): Promise<ProductWithVariants[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      variants (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Error al obtener productos');
  }

  return data as ProductWithVariants[];
}

export async function getProduct(id: string): Promise<ProductWithVariants> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      variants (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw new Error('Error al obtener producto');
  }

  return data as ProductWithVariants;
}

export async function createProductAction(input: CreateProductInput & { variants?: Omit<CreateVariantInput, 'product_id'>[] }): Promise<ProductWithVariants> {
  await validateAdminAccess();
  
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({
      sku_parent: input.sku_parent,
      brand: input.brand,
      style: input.style,
      price: input.price,
      cost: input.cost,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating product:', error);
    if (error.code === '23505') {
      throw new Error('El SKU padre ya existe');
    }
    throw new Error('Error al crear producto');
  }

  // Create variants if provided
  if (input.variants && input.variants.length > 0) {
    const variantsToInsert = input.variants.map(variant => ({
      ...variant,
      product_id: product.id,
    }));

    const { error: variantsError } = await supabaseAdmin
      .from('variants')
      .insert(variantsToInsert);

    if (variantsError) {
      console.error('Error creating variants:', variantsError);
      // Delete the product if variants creation fails
      await supabaseAdmin.from('products').delete().eq('id', product.id);
      if (variantsError.code === '23505') {
        throw new Error('Uno de los SKU hijo ya existe');
      }
      throw new Error('Error al crear variantes del producto');
    }
  }

  // Fetch the complete product with variants
  const { data: completeProduct, error: fetchError } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      variants (*)
    `)
    .eq('id', product.id)
    .single();

  if (fetchError) {
    console.error('Error fetching complete product:', fetchError);
    throw new Error('Error al obtener producto completo');
  }

  revalidatePath('/admin/products');
  return completeProduct as ProductWithVariants;
}

export async function updateProductAction(id: string, input: UpdateProductInput): Promise<ProductWithVariants> {
  await validateAdminAccess();
  
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .update(input)
    .eq('id', id)
    .select(`
      *,
      variants (*)
    `)
    .single();

  if (error) {
    console.error('Error updating product:', error);
    if (error.code === '23505') {
      throw new Error('El SKU padre ya existe');
    }
    throw new Error('Error al actualizar producto');
  }

  revalidatePath('/admin/products');
  return product as ProductWithVariants;
}

export async function deleteProductAction(id: string): Promise<{ success: boolean }> {
  await validateAdminAccess();
  
  // Check for inventory dependencies first
  const { data: hasInventory, error: inventoryError } = await supabaseAdmin
    .from('variants')
    .select('id')
    .eq('product_id', id)
    .limit(1);

  if (inventoryError) {
    console.error('Error checking inventory:', inventoryError);
    throw new Error('Error al verificar inventario');
  }

  if (hasInventory && hasInventory.length > 0) {
    throw new Error('No se puede eliminar el producto porque tiene variantes asociadas');
  }

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Error al eliminar producto');
  }

  revalidatePath('/admin/products');
  return { success: true };
}

export async function createVariantAction(input: CreateVariantInput): Promise<Tables<'variants'>> {
  await validateAdminAccess();
  
  const { data: variant, error } = await supabaseAdmin
    .from('variants')
    .insert(input)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating variant:', error);
    if (error.code === '23505') {
      throw new Error('El SKU hijo ya existe');
    }
    throw new Error('Error al crear variante');
  }

  revalidatePath('/admin/products');
  return variant;
}

export async function updateVariantAction(id: string, input: UpdateVariantInput): Promise<Tables<'variants'>> {
  await validateAdminAccess();
  
  const { data: variant, error } = await supabaseAdmin
    .from('variants')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating variant:', error);
    if (error.code === '23505') {
      throw new Error('El SKU hijo ya existe');
    }
    throw new Error('Error al actualizar variante');
  }

  revalidatePath('/admin/products');
  return variant;
}

export async function deleteVariantAction(id: string): Promise<{ success: boolean }> {
  await validateAdminAccess();
  
  const { error } = await supabaseAdmin
    .from('variants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting variant:', error);
    throw new Error('Error al eliminar variante');
  }

  revalidatePath('/admin/products');
  return { success: true };
}

export async function checkSkuUniquenessAction(sku: string, type: 'parent' | 'child', excludeId?: string): Promise<boolean> {
  const table = type === 'parent' ? 'products' : 'variants';
  const column = type === 'parent' ? 'sku_parent' : 'sku_child';
  
  let query = supabaseAdmin
    .from(table)
    .select('id')
    .eq(column, sku);
  
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking SKU uniqueness:', error);
    throw new Error('Error al verificar unicidad de SKU');
  }
  
  return data.length === 0;
}