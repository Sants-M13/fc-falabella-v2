import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'promotora']);

export const createUserSchema = z.object({
  email: z
    .string()
    .email('Correo electrónico inválido')
    .min(1, 'El correo electrónico es requerido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
    ),
  role: userRoleSchema,
  store_id: z.string().uuid('ID de tienda inválido').nullable().optional(),
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .email('Correo electrónico inválido')
    .optional(),
  role: userRoleSchema.optional(),
  store_id: z.string().uuid('ID de tienda inválido').nullable().optional(),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;