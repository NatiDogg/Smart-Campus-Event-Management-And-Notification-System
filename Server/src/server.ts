import express from 'express'
import type {Express} from 'express' 
import {config} from 'dotenv'
import { env } from './utils/zodEnvFilesValidator.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
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
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});



const startServer = async()=>{
       try {
          
        app.listen(port,()=>{
            console.log("Server has started and listening to port "+port);
        })
       } catch (error) {
        console.log(error);
        process.exit(1)
       }
}
startServer();
















