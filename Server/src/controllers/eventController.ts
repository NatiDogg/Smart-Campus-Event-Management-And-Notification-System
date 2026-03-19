import type { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authMiddleware.js";
import EventService from "../services/eventService.js";
import { isValid } from "../utils/validMongodbId.js";
import { handleError } from "../helpers/handleError.js";


export const getAllEventsHandler = async(req:Request, res:Response)=>{
       try {
         const result = await EventService.getAllEvents()
         res.status(200).json(result);
        
       } catch (error) {
        return handleError(res,error);
       }
}

export const getSingleEventHandler = async (req:AuthRequest<{id: string}>, res:Response)=>{
       const {id: studentId} = req.userAccessInfo
        const {id: eventId} = req.params
          if(!isValid(eventId)){
             return res.status(400).json({
                success:false,
                message: "Invalid ID Format!"
             })
         }
        try {
            const result = await EventService.getSingleEvent(eventId,studentId);
            res.status(200).json(result);
        } catch (error) {
            return handleError(res,error);
            
        }
}



