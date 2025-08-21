'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../database.types';
import { ProfileInput, ProfileUpdate, ProfileWithStore } from '@/../../packages/types';
import { CreateUserInput, UpdateUserInput } from '@/lib/validations/users';
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

export async function getUsers(): Promise<ProfileWithStore[]> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select(`
      *,
      stores (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error al obtener usuarios');
  }

  return data as ProfileWithStore[];
}

export async function createUserAction(input: CreateUserInput): Promise<ProfileWithStore> {
  // Validate admin role for this operation
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
    throw new Error('Solo los administradores pueden crear usuarios');
  }
  
  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      role: input.role
    }
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    if (authError.message?.includes('already registered')) {
      throw new Error('Este correo electrónico ya está registrado');
    }
    throw new Error('Error al crear usuario');
  }

  // Create profile
  const profileData: ProfileInput = {
    email: input.email,
    role: input.role,
    store_id: input.store_id || null,
  };

  // First check if profile already exists
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', authData.user.id)
    .single();

  let profile;
  if (existingProfile) {
    // Profile already exists, update it
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(profileData)
      .eq('id', authData.user.id)
      .select(`
        *,
        stores (
          id,
          name
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating existing profile:', updateError);
      throw new Error('Error al actualizar perfil de usuario existente');
    }
    profile = updatedProfile;
  } else {
    // Create new profile
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        ...profileData
      })
      .select(`
        *,
        stores (
          id,
          name
        )
      `)
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error('Error al crear perfil de usuario');
    }
    profile = newProfile;
  }

  revalidatePath('/admin/users');
  return profile as ProfileWithStore;
}

export async function updateUserAction(id: string, input: UpdateUserInput): Promise<ProfileWithStore> {
  // Validate admin role for this operation
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
    throw new Error('Solo los administradores pueden actualizar usuarios');
  }
  
  // Update email in auth if provided
  if (input.email) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      { email: input.email }
    );
    
    if (authError) {
      console.error('Error updating auth user:', authError);
      if (authError.message?.includes('already registered')) {
        throw new Error('Este correo electrónico ya está registrado');
      }
      throw new Error('Error al actualizar correo electrónico');
    }
  }
  
  // Update profile
  const updateData: ProfileUpdate = {};
  if (input.email) updateData.email = input.email;
  if (input.role) updateData.role = input.role;
  if (input.store_id !== undefined) updateData.store_id = input.store_id;
  
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      stores (
        id,
        name
      )
    `)
    .single();

  if (profileError) {
    console.error('Error updating profile:', profileError);
    throw new Error('Error al actualizar usuario');
  }

  revalidatePath('/admin/users');
  return profile as ProfileWithStore;
}

export async function deleteUserAction(id: string): Promise<{ success: boolean }> {
  // Validate admin role for this operation
  const supabase = await createSupabaseServerClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) {
    throw new Error('No autorizado');
  }
  
  // Prevent self-deletion
  if (currentUser.id === id) {
    throw new Error('No puedes eliminar tu propia cuenta');
  }
  
  const { data: currentProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single();
  
  if (currentProfile?.role !== 'admin') {
    throw new Error('Solo los administradores pueden eliminar usuarios');
  }
  
  // Get user info before deletion for better error handling
  const { data: userToDelete } = await supabaseAdmin
    .from('profiles')
    .select('email, role')
    .eq('id', id)
    .single();
  
  if (!userToDelete) {
    throw new Error('Usuario no encontrado');
  }
  
  // Delete profile first (due to foreign key constraint)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', id);
  
  if (profileError) {
    console.error('Error deleting profile:', profileError);
    throw new Error('Error al eliminar perfil de usuario');
  }
  
  // Try to delete auth user - if it fails, it might already be deleted
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  
  if (authError) {
    console.warn('Warning deleting auth user (might already be deleted):', authError);
    // Don't throw error here as profile is already deleted
    // The auth user might have been deleted already or not exist
  }
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function resetUserPasswordAction(email: string): Promise<{ success: boolean }> {
  // Validate admin role for this operation
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
    throw new Error('Solo los administradores pueden restablecer contraseñas');
  }
  
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });
  
  if (error) {
    console.error('Error resetting password:', error);
    throw new Error('Error al enviar correo de restablecimiento de contraseña');
  }
  
  return { success: true };
}

export async function checkEmailUniquenessAction(email: string, excludeId?: string): Promise<boolean> {
  let query = supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email);
  
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking email uniqueness:', error);
    throw new Error('Error al verificar correo electrónico');
  }
  
  return data.length === 0;
}