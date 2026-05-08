import express from 'express'
import type { Express, Request, Response } from 'express'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import eventRouter from './routes/eventRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import registrationRouter from './routes/registrationRoutes.js'
import organizerRouter from './routes/organizerRoutes.js'
import userRouter from './routes/userRoutes.js'
import interestRouter from './routes/interestRoutes.js'
import subscriptionRouter from './routes/subscriptionRoutes.js'
import studentRouter from './routes/studentRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import feedBackRouter from './routes/feedBackRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import auditLogRouter from './routes/auditLogRoutes.js'
import cronRouter from './routes/cronRoutes.js'
config()

const app: Express = express()

const allowedOrigins = ["https://smartcampus-event.vercel.app", "http://localhost:5173"]
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/api/category', categoryRouter)
app.use("/api/audit", auditLogRouter)
app.use("/api/auth", authRouter)
app.use("/api/event", eventRouter)
app.use("/api/student", studentRouter)
app.use("/api/interest", interestRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/registration", registrationRouter)
app.use("/api/subscription", subscriptionRouter)
app.use("/api/feedback", feedBackRouter)
app.use("/api/admin", adminRouter)
app.use("/api/organizer", organizerRouter)
app.use("/api/user", userRouter)
app.use("/api/cron", cronRouter)

app.get('/', (req: Request, res: Response) => {
    res.send("api is connected successfully!")
})

export default app