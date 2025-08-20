import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signIn, signOut, getUserProfile } from '@/lib/auth';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('Auth functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      });
      
      const { supabase } = await import('@/lib/supabase');
      supabase.auth.signInWithPassword = mockSignIn;

      const result = await signIn('test@example.com', 'password');
      
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result.error).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const mockSignOut = vi.fn().mockResolvedValue({ error: null });
      
      const { supabase } = await import('@/lib/supabase');
      supabase.auth.signOut = mockSignOut;

      const result = await signOut();
      
      expect(mockSignOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });
  });
});