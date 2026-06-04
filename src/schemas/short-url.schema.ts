import { z } from 'zod'

export const urlSchema = z.object({
    longUrl: z.url()
})