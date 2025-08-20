/**
 * Script to create test users for UAT testing
 * Run with: node scripts/create-test-users.js
 */

const { createClient } = require('@supabase/supabase-js');

// Use remote Supabase instance (from .env.local)
const supabaseUrl = 'https://pbcdbmzrumntbhpispvb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiY2RibXpydW1udGJocGlzcHZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY0NjgwNiwiZXhwIjoyMDcxMjIyODA2fQ.L2eLH2Qoe97BSKy7EA6QNVpPOkzZQPmMvFc0vS3359Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUsers() {
  console.log('Creating test users for UAT...');

  // Create admin user
  const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
    email: 'admin@example.com',
    password: 'password123',
    email_confirm: true
  });

  if (adminError) {
    console.error('Error creating admin user:', adminError);
  } else {
    console.log('✅ Admin user created:', adminUser.user.email);
  }

  // Create promotora user
  const { data: promotoraUser, error: promotoraError } = await supabase.auth.admin.createUser({
    email: 'promotora@example.com',
    password: 'password123',
    email_confirm: true
  });

  if (promotoraError) {
    console.error('Error creating promotora user:', promotoraError);
  } else {
    console.log('✅ Promotora user created:', promotoraUser.user.email);
  }

  console.log('Test user creation complete!');
  process.exit(0);
}

createTestUsers().catch(console.error);