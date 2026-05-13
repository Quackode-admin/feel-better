import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Correo inválido').max(255),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(100),
})

export const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(100)
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
