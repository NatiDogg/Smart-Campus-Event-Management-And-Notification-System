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
    CLOUD_NAME: z.string().min(4),
    ADMIN_EMAIL: z.string().min(3),
    ADMIN_PASS: z.string().min(6),
    SENDER_EMAIL: z.string().min(4),
    SMTP_USER: z.string().min(4),
    SMTP_PASS: z.string().min(4),
    FCM_SERVICE_ACCOUNT_KEY: z.string().min(2),
    GEMINI_API_KEY: z.string().min(4),
    GOOGLE_CLIENT_ID: z.string().min(4),
    GOOGLE_CLIENT_SECRET: z.string().min(4),
    GOOGLE_REDIRECT_URI: z.string().min(4),
    VITE_FRONTEND_URL: z.string().min(4),
    IS_DEPLOYED: z.string().min(3)



})

export const env = envSchema.parse(process.env);