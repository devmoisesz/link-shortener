import { z } from 'zod'

export const urlSchema = z.object({
    long_url: z.url()
})