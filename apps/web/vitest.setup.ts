import { beforeEach } from 'vitest';

beforeEach(() => {
  // Setup mocks for Supabase client
  global.fetch = fetch;
});