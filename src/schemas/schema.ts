import { email, z } from 'zod'

export const urlSchema = z.object({
    longUrl: z
        .url()
        .max(2048, 'URL muito longa (máximo 2048 caracteres)')
        .min(5, 'URL muito curta')
})

export const userSchema = z.object({
    name: z
        .string()
        .min(3)
        .max(100),
    email: z
        .email()
        .toLowerCase(),
    password: z
        .string()
        .min(6)
        .max(50)
})