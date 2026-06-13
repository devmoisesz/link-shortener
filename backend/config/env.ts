import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(['test', 'production']),

    MONGO_URI_TEST: z.string().min(1),
    MONGO_URI_PROD: z.string().min(1),

    PORT: z.coerce.number().default(3000),

    FRONTEND_URL: z.string().url(),

    JWT_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),

    TOKEN_TESTING: z.string()
});

const parsedEnv = envSchema.safeParse(process.env);

if(!parsedEnv.success){
    console.error("Variáveis de ambiente inválidas:");
    console.error(parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;