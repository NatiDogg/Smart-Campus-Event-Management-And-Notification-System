import express from 'express'
import type {Express} from 'express' 
import {config} from 'dotenv'
import { env } from './utils/zodEnvFilesValidator.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectToDb from './config/connectDb.js';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import registrationRouter from './routes/registrationRoutes.js';
import organizerRouter from './routes/organizerRoutes.js';
import userRouter from './routes/userRoutes.js';
import { initCronJobs } from './utils/cronManager.js';
import interestRouter from './routes/interestRoutes.js';
import subscriptionRouter from './routes/subscriptionRoutes.js';
import studentRouter from './routes/studentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import feedBackRouter from './routes/feedBackRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
config();

const app:Express = express();
const port = env.PORT || 5000
const allowedOrigins = ["http://localhost:5173"]
const corsOptions = {
    origin: allowedOrigins,
    credentials: true
}

//middlewares
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))

//routes
app.use('/api/category',categoryRouter)
// Authentication (Login, Register, Logout)
app.use("/api/auth",authRouter);

// Public / Student Resources (Viewing Events)
app.use("/api/event",eventRouter);
app.use("api/student",studentRouter);

//student action marking or unmarking interest
app.use("/api/interest",interestRouter);

// user notification page handler
app.use("/api/notification",notificationRouter);
// Student Actions (Interactions with Events)
app.use("/api/registration",registrationRouter);
app.use("/api/subscription",subscriptionRouter);

//feedback
app.use("/api/feedback",feedBackRouter);

// Role-Based Management (Creation & System Control)
app.use("/api/admin",adminRouter);
app.use("/api/organizer",organizerRouter);


//all user action
app.use("/api/user", userRouter);





const startServer = async()=>{
       try {
          await connectToDb();
          initCronJobs()
        app.listen(port,()=>{
            console.log("Server has started and listening to port "+port);
        })
         
       } catch (error) {
        console.log(error);
        process.exit(1)
       }
}
startServer();
















