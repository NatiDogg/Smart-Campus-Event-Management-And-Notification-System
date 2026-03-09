import type { Request, Response } from "express";
import AppError from "../utils/appError.js";
import { createEventSchema,updateEventSchema } from "../utils/zodEventValidator.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import EventService from "../services/eventService.js";
import { isValid } from "../utils/validMongodbId.js";


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

export const getEventsByOrganizerHandler = async(req:AuthRequest, res:Response)=>{
        const {id} = req.userAccessInfo
      try {
          const result = await EventService.getEventsByOrganizer(id);
          return res.status(200).json(result);
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
export const updateEventHandler = async(req:AuthRequest<{id: string}>, res: Response)=>{
         const {id: organizerId} = req.userAccessInfo
         const {id: eventId} = req.params

         if(!isValid(eventId)){
             return res.status(400).json({
                success:false,
                message: "Invalid ID Format!"
             })
         }
         
         const parsed = updateEventSchema.safeParse(req.body);
         if(!parsed.success){
            return res.status(400).json({
                success:false,
                message:parsed.error.flatten()
            })
         }
     
         try {
            const result = await EventService.updateEventByOrganizer(parsed.data,organizerId, eventId)
            return res.status(200).json(result);
            
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

export const deleteEventHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
     const { id: organizerId } = req.userAccessInfo;
     const { id: eventId } = req.params;

     if (!isValid(eventId)) {
       return res.status(400).json({
         success: false,
         message: "Invalid ID Format!",
       });
     }

    try {
         
        const result = await EventService.deleteEvent(organizerId,eventId);
        return res.status(200).json(result);
         
        
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

export const getAllEventsHandler = async(req:Request, res:Response)=>{
       try {
         const result = await EventService.getAllEvents()
         res.status(200).json(result);
        
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

export const getSingleEventHandler = async (req:Request<{id: string}>, res:Response)=>{
        const {id: eventId} = req.params
          if(!isValid(eventId)){
             return res.status(400).json({
                success:false,
                message: "Invalid ID Format!"
             })
         }
        try {
            const result = await EventService.getSingleEvent(eventId);
            res.status(200).json(result);
        } catch (error) {
            
        }
}

export const getPendingEventsHandler = async(req:AuthRequest, res:Response)=>{
     try {
        
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

