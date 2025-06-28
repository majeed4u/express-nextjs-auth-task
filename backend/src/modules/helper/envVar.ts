import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();





// Define the schema for environment variables using zod


const envSchema = z.object({
    PORT: z.string().default('7000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET_ACCESS_TOKEN_SECRET: z.string().default('your_jwt_access_token_secret'),
    JWT_SECRET_REFRESH_TOKEN_SECRET: z.string().default('your_jwt_refresh_token_secret'),
    JWT_SECRET_ACCESS_TOKEN_EXPIRES_IN: z.string().default('1h'),
    JWT_SECRET_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
    DATABASE_URL: z.string().url(),
})

const parseEnv = envSchema.safeParse(process.env);
if (!parseEnv.success) {
    console.error('Invalid environment variables:', parseEnv.error.format());
    throw new Error('Invalid environment variables');
}
export const env = parseEnv.data;