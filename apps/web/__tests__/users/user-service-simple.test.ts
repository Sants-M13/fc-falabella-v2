import { describe, it, expect } from 'vitest';
import { createUserSchema, updateUserSchema, resetPasswordSchema } from '@/lib/validations/users';

describe('User Service Integration', () => {
  describe('Validation Schema Integration', () => {
    it('debe validar datos de usuario correctamente', () => {
      const validUserData = {
        email: 'admin@falabella.com',
        password: 'SecurePass123',
        role: 'admin' as const,
        store_id: null,
      };

      const result = createUserSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('admin@falabella.com');
        expect(result.data.role).toBe('admin');
      }
    });

    it('debe validar actualización de usuario correctamente', () => {
      const updateData = {
        email: 'updated@falabella.com',
        role: 'promotora' as const,
      };

      const result = updateUserSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it('debe validar restablecimiento de contraseña correctamente', () => {
      const resetData = {
        email: 'user@falabella.com',
      };

      const result = resetPasswordSchema.safeParse(resetData);
      expect(result.success).toBe(true);
    });

    it('debe rechazar datos inválidos', () => {
      const invalidUserData = {
        email: 'not-an-email',
        password: '123', // Too short
        role: 'invalid-role' as any,
      };

      const result = createUserSchema.safeParse(invalidUserData);
      expect(result.success).toBe(false);
    });

    it('debe validar emails únicos correctamente', () => {
      const emails = [
        'valid@falabella.com',
        'test@falabella.co',
        'user@company.com',
      ];

      emails.forEach(email => {
        const result = resetPasswordSchema.safeParse({ email });
        expect(result.success).toBe(true);
      });
    });

    it('debe validar UUIDs de tienda correctamente', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '00000000-0000-0000-0000-000000000000',
      ];

      validUUIDs.forEach(uuid => {
        const result = createUserSchema.safeParse({
          email: 'test@falabella.com',
          password: 'SecurePass123',
          role: 'promotora',
          store_id: uuid,
        });
        expect(result.success).toBe(true);
      });
    });

    it('debe rechazar UUIDs inválidos', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        'invalid-format',
        '',
      ];

      invalidUUIDs.forEach(uuid => {
        const result = createUserSchema.safeParse({
          email: 'test@falabella.com',
          password: 'SecurePass123',
          role: 'promotora',
          store_id: uuid,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Business Logic Validation', () => {
    it('debe permitir admin sin store_id', () => {
      const adminData = {
        email: 'admin@falabella.com',
        password: 'SecurePass123',
        role: 'admin' as const,
        store_id: null,
      };

      const result = createUserSchema.safeParse(adminData);
      expect(result.success).toBe(true);
    });

    it('debe permitir promotora con store_id', () => {
      const promotoraData = {
        email: 'promotora@falabella.com',
        password: 'SecurePass123',
        role: 'promotora' as const,
        store_id: '550e8400-e29b-41d4-a716-446655440000',
      };

      const result = createUserSchema.safeParse(promotoraData);
      expect(result.success).toBe(true);
    });

    it('debe validar requisitos de contraseña segura', () => {
      const passwords = [
        { password: 'SecurePass123', valid: true },
        { password: 'weakpass', valid: false }, // No uppercase, no number
        { password: 'WEAKPASS123', valid: false }, // No lowercase
        { password: 'WeakPass', valid: false }, // No number
        { password: 'Short1', valid: false }, // Too short
        { password: 'VerySecurePassword123', valid: true },
      ];

      passwords.forEach(({ password, valid }) => {
        const result = createUserSchema.safeParse({
          email: 'test@falabella.com',
          password,
          role: 'promotora',
        });
        expect(result.success).toBe(valid);
      });
    });

    it('debe validar formatos de email válidos para Colombia', () => {
      const emails = [
        { email: 'user@falabella.com', valid: true },
        { email: 'promotora@falabella.com.co', valid: true },
        { email: 'admin@company.co', valid: true },
        { email: 'test.user+tag@domain.co', valid: true },
        { email: 'invalid-email', valid: false },
        { email: '@domain.com', valid: false },
        { email: 'user@', valid: false },
        { email: 'spaces in@email.com', valid: false },
      ];

      emails.forEach(({ email, valid }) => {
        const result = resetPasswordSchema.safeParse({ email });
        expect(result.success).toBe(valid);
      });
    });
  });
});