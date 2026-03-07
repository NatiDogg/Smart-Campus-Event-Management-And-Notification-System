import z from 'zod'
import { config } from 'dotenv'
config()

const envSchema = z.object({
    PORT: z.string().min(4),
    MONGODB_URI: z.string().min(4),
    JWT_ACCESS_SECRET_KEY: z.string().min(4),
    JWT_REFRESH_SECRET_KEY: z.string().min(4),
    NODE_ENV: z.string().min(4),
    CLOUD_SECRET_KEY: z.string().min(4),
    CLOUD_API_KEY: z.string().min(4),
    CLOUD_NAME: z.string().min(4)



})

export const env = envSchema.parse(process.env);