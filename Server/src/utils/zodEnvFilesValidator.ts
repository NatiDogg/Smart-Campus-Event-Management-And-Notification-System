import z from 'zod'
import { config } from 'dotenv'
config()

const envSchema = z.object({
    PORT: z.string().min(4)
})

export const env = envSchema.parse(process.env);