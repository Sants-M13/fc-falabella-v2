import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'promotora';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    role: data.role as UserRole,
    storeId: data.store_id || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createUserProfile(
  userId: string,
  email: string,
  role: UserRole,
  storeId?: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      role,
      store_id: storeId || null,
    })
    .select()
    .single();

  return { data, error };
}