import { z } from 'zod'

export const urlSchema = z.object({
    longUrl: z
        .url()
        .max(2048, 'URL muito longa (máximo 2048 caracteres)')
        .min(5, 'URL muito curta')
})