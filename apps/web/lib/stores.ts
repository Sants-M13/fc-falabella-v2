import { supabase } from './supabase'
import type { Store, StoreInput, StoreUpdate } from '@/../../packages/types'

export class StoreService {
  /**
   * Crear nueva tienda
   */
  static async createStore(store: StoreInput): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .insert([store])
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear tienda: ${error.message}`)
    }

    return data
  }

  /**
   * Obtener todas las tiendas
   */
  static async getAllStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(`Error al obtener tiendas: ${error.message}`)
    }

    return data || []
  }

  /**
   * Obtener tienda por ID
   */
  static async getStoreById(id: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No encontrada
      }
      throw new Error(`Error al obtener tienda: ${error.message}`)
    }

    return data
  }

  /**
   * Actualizar tienda existente
   */
  static async updateStore(id: string, updates: StoreUpdate): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar tienda: ${error.message}`)
    }

    return data
  }

  /**
   * Eliminar tienda
   */
  static async deleteStore(id: string): Promise<void> {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Error al eliminar tienda: ${error.message}`)
    }
  }

  /**
   * Verificar si nombre de tienda está disponible
   */
  static async isStoreNameAvailable(name: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('stores')
      .select('id')
      .eq('name', name)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Error al verificar disponibilidad del nombre: ${error.message}`)
    }

    return !data || data.length === 0
  }

  /**
   * Verificar dependencias antes de eliminar
   */
  static async checkStoreDependencies(storeId: string): Promise<{
    hasProfiles: boolean;
    profileCount: number;
  }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('store_id', storeId)

    if (error) {
      throw new Error(`Error al verificar dependencias: ${error.message}`)
    }

    return {
      hasProfiles: (data?.length || 0) > 0,
      profileCount: data?.length || 0
    }
  }
}