import { config } from 'dotenv'
import { vi } from 'vitest'

config()

process.env.NODE_ENV = 'test'
process.env.IS_DEPLOYED = 'false'
process.env.JWT_ACCESS_SECRET_KEY = 'test-access-secret'
process.env.JWT_REFRESH_SECRET_KEY = 'test-refresh-secret'
process.env.ADMIN_EMAIL = 'admin@test.com'
process.env.ADMIN_PASS = 'adminpass123'
process.env.BREVO_API_KEY = 'test-brevo-key'
process.env.CRON_SECRET = 'test-cron-secret'
process.env.VITE_FRONTEND_URL = 'http://localhost:5173'

vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})