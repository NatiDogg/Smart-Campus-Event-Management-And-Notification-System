import express from 'express'
import type {Express} from 'express' 
import {config} from 'dotenv'
import { env } from './utils/zodEnvFilesValidator.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectToDb from './config/connectDb.js';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
config();

const app:Express = express();
const port = env.PORT || 5000
const allowedOrigins = ["http://localhost:3000"]
const corsOptions = {
    origin: allowedOrigins,
    credentials: true
}

//middlewares
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions))

//routes
app.use("/api/auth",authRouter);
app.use("/api/events",eventRouter);


const startServer = async()=>{
       try {
          //await connectToDb();
        app.listen(port,()=>{
            console.log("Server has started and listening to port "+port);
        })
       } catch (error) {
        console.log(error);
        process.exit(1)
       }
}
startServer();
















