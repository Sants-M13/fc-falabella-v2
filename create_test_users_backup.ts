// Backup of seed route before reverting
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    // Create test store
    const { data: store, error: storeError } = await supabaseAdmin
      .from('stores')
      .upsert({
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Loja Teste SP',
        max_skus: 1000,
        max_brands: 50,
        max_inventory: 10000
      })
      .select()
      .single();

    if (storeError) {
      console.error('Store error:', storeError);
    }

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'Test@123',
      email_confirm: true,
    });

    if (adminError) {
      console.error('Admin user error:', adminError);
    } else if (adminUser?.user) {
      // Create admin profile
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: adminUser.user.id,
          email: 'admin@example.com',
          role: 'admin',
          store_id: null
        });
    }

    // Create promotora user
    const { data: promotoraUser, error: promotoraError } = await supabaseAdmin.auth.admin.createUser({
      email: 'promotora@example.com',
      password: 'Test@123',
      email_confirm: true,
    });

    if (promotoraError) {
      console.error('Promotora user error:', promotoraError);
    } else if (promotoraUser?.user) {
      // Create promotora profile
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: promotoraUser.user.id,
          email: 'promotora@example.com',
          role: 'promotora',
          store_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Test users created successfully',
      users: [
        { email: 'admin@example.com', password: 'Test@123', role: 'admin' },
        { email: 'promotora@example.com', password: 'Test@123', role: 'promotora', store: 'Loja Teste SP' }
      ]
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test users'
    }, { status: 500 });
  }
}