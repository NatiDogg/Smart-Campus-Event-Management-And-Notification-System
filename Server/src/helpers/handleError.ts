import AppError from "../utils/appError.js"
import type { Response } from "express"
export const handleError = (res:Response, error: unknown)=>{
       console.log("DETAILED ERROR:", error);
       if(error instanceof AppError){

         return res.status(error.statusCode).json({
            success:false,
            message: error.message
         })
       }
       return res.status(500).json({
            success:false,
            message: "Internal Server Error!"
         })
}