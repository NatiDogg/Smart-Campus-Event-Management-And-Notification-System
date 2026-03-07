import type { Request, Response } from "express";
import AppError from "../utils/appError.js";
import { createEventSchema } from "../utils/zodEventValidator.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import EventService from "../services/eventService.js";


export const createEventHandler = async(req:AuthRequest, res:Response)=>{
       const {id} = req.userAccessInfo
       const file = req.file
        const parsed = createEventSchema.safeParse(req.body);
       if(!parsed.success){
        return res.status(400).json({
            success:false,
            message: parsed.error.flatten()
        })
       }
       if(!file){
         return res.status(400).json({
            success:false,
            message: "Image is Required!"
        })
        
       }
       
        
    
      try {
         
         const result = await EventService.createEvent(parsed.data,id,file.buffer);
         return res.status(201).json(result);
         
        
      } catch (error) {
        if(error instanceof AppError){
             return res.status(error.statusCode).json({
                  success:false,
                  message: error.message
             })
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
      }
}