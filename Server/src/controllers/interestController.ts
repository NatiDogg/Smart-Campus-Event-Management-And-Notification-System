import { AuthRequest } from '../middlewares/authMiddleware.js'
import AppError from '../utils/appError.js'
import type {Request, Response} from 'express'
import { isValid } from '../utils/validMongodbId.js'
import RegistrationService from '../services/registrationService.js'

export const markInterestHandler = async(req:AuthRequest, res:Response)=>{
    try {
        
    } catch (error) {
         if (error instanceof AppError) {
           return res.status(error.statusCode).json({
             success: false,
             message: error.message,
           });
         }
         return res.status(500).json({
           success: false,
           message: "Internal Server Error",
         });
    }
}
export const unMarkInterestHandler = async(req:AuthRequest, res:Response)=>{
    try {
        
    } catch (error) {
         if (error instanceof AppError) {
           return res.status(error.statusCode).json({
             success: false,
             message: error.message,
           });
         }
         return res.status(500).json({
           success: false,
           message: "Internal Server Error",
         });
    }
}



