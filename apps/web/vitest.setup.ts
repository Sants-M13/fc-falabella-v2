import { beforeEach } from 'vitest';
import '@testing-library/jest-dom';

beforeEach(() => {
  // Setup mocks for Supabase client
  global.fetch = fetch;
});