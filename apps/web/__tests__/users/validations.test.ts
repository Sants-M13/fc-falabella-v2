import { describe, it, expect } from 'vitest';
import { 
  createUserSchema, 
  updateUserSchema, 
  resetPasswordSchema,
  userRoleSchema 
} from '@/lib/validations/users';

describe('User Validation Schemas', () => {
  describe('userRoleSchema', () => {
    it('debe aceptar rol admin', () => {
      const result = userRoleSchema.safeParse('admin');
      expect(result.success).toBe(true);
      expect(result.data).toBe('admin');
    });

    it('debe aceptar rol promotora', () => {
      const result = userRoleSchema.safeParse('promotora');
      expect(result.success).toBe(true);
      expect(result.data).toBe('promotora');
    });

    it('debe rechazar rol inválido', () => {
      const result = userRoleSchema.safeParse('supervisor');
      expect(result.success).toBe(false);
    });
  });

  describe('createUserSchema', () => {
    it('debe aceptar datos válidos de usuario admin', () => {
      const validUser = {
        email: 'admin@falabella.com',
        password: 'SecurePass123',
        role: 'admin',
        store_id: null
      };
      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('debe aceptar datos válidos de usuario promotora', () => {
      const validUser = {
        email: 'promotora@falabella.com',
        password: 'SecurePass123',
        role: 'promotora',
        store_id: '550e8400-e29b-41d4-a716-446655440000'
      };
      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('debe rechazar email inválido', () => {
      const invalidUser = {
        email: 'not-an-email',
        password: 'SecurePass123',
        role: 'admin'
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Correo electrónico inválido');
      }
    });

    it('debe rechazar contraseña muy corta', () => {
      const invalidUser = {
        email: 'test@falabella.com',
        password: 'Pass1',
        role: 'admin'
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La contraseña debe tener al menos 8 caracteres');
      }
    });

    it('debe rechazar contraseña sin mayúscula', () => {
      const invalidUser = {
        email: 'test@falabella.com',
        password: 'password123',
        role: 'admin'
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número');
      }
    });

    it('debe rechazar contraseña sin minúscula', () => {
      const invalidUser = {
        email: 'test@falabella.com',
        password: 'PASSWORD123',
        role: 'admin'
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número');
      }
    });

    it('debe rechazar contraseña sin número', () => {
      const invalidUser = {
        email: 'test@falabella.com',
        password: 'PasswordOnly',
        role: 'admin'
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número');
      }
    });

    it('debe rechazar store_id inválido', () => {
      const invalidUser = {
        email: 'test@falabella.com',
        password: 'SecurePass123',
        role: 'promotora',
        store_id: 'not-a-uuid'
      };
      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID de tienda inválido');
      }
    });
  });

  describe('updateUserSchema', () => {
    it('debe aceptar actualización parcial válida', () => {
      const validUpdate = {
        email: 'newemail@falabella.com'
      };
      const result = updateUserSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('debe aceptar actualización de rol', () => {
      const validUpdate = {
        role: 'promotora'
      };
      const result = updateUserSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('debe aceptar actualización de store_id', () => {
      const validUpdate = {
        store_id: '550e8400-e29b-41d4-a716-446655440000'
      };
      const result = updateUserSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('debe aceptar objeto vacío (sin cambios)', () => {
      const result = updateUserSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('debe rechazar email inválido en actualización', () => {
      const invalidUpdate = {
        email: 'not-an-email'
      };
      const result = updateUserSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Correo electrónico inválido');
      }
    });
  });

  describe('resetPasswordSchema', () => {
    it('debe aceptar email válido', () => {
      const validReset = {
        email: 'user@falabella.com'
      };
      const result = resetPasswordSchema.safeParse(validReset);
      expect(result.success).toBe(true);
    });

    it('debe rechazar email vacío', () => {
      const invalidReset = {
        email: ''
      };
      const result = resetPasswordSchema.safeParse(invalidReset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El correo electrónico es requerido');
      }
    });

    it('debe rechazar email inválido', () => {
      const invalidReset = {
        email: 'not-an-email'
      };
      const result = resetPasswordSchema.safeParse(invalidReset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Correo electrónico inválido');
      }
    });
  });
});