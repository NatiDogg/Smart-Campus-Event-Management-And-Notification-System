import { request, type Request, type Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import AppError from "../utils/appError.js";
import AdminService from "../services/adminService.js";
import { createOrganizerSchema } from "../utils/zodOrganizerValidator.js";
import { categoryCreationSchema } from "../utils/zodCategoryValidator.js";
import { Types } from "mongoose";
import { isValid } from "../utils/validMongodbId.js";
import { handleError } from "../helpers/handleError.js";

export const createOrganizerHandler  =async(req: Request, res:Response)=>{
        const parsed = createOrganizerSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message: parsed.error.flatten()

            })
        }
        try {
            const result = await AdminService.createOrganizer(parsed.data)
            return res.status(201).json(result)
            
        } catch (error) {
            return handleError(res,error);
        }
}

export const createNewCategoryHandler = async(req:Request, res:Response)=>{
       const parsed = categoryCreationSchema.safeParse(req.body)
       if(!parsed.success){
         return res.status(400).json({
          success:false,
          message: parsed.error.flatten()
         })
       }
     try {
      const result = await AdminService.createNewCategory(parsed.data)
      return res.status(201).json(result)
       
     } catch (error) {
         return handleError(res,error);
     }
}

export const approveEventHandler = async(req:Request<{id: string}>, res:Response)=>{
        const {id: eventId} = req.params
        if(!isValid(eventId)){
          return res.status(400).json({
            success: false,
            message: "Invalid ID Format!!"
          })
        }
      try {
          const result = await AdminService.approveEvent(eventId);
          return res.status(200).json(result);
         
      } catch (error) {
         return handleError(res,error);
      }
}
export const rejectEventHandler = async(req:Request<{id: string}>, res:Response)=>{
         const { id: eventId } = req.params;
         if (!isValid(eventId)) {
           return res.status(400).json({
             success: false,
             message: "Invalid ID Format!!",
           });
         }
    
      try {
         const result = await AdminService.rejectEvent(eventId);
          return res.status(200).json(result);
         
      } catch (error) {
         return handleError(res,error);
      }
}
export const getAllEventsHandler = async(req:Request, res:Response)=>{
        try {
           const result = await AdminService.getAllEvents()
           return res.status(200).json(result)
        } catch (error) {
           return handleError(res,error);
        }

}

export const getAllUsersHandler = async(req:Request, res:Response)=>{
        try {
           const result = await AdminService.getAllUsers()
           return res.status(200).json(result)
        } catch (error) {
           return handleError(res,error);
        }

}
export const deactivateUserHandler = async(req:Request<{id:string}>, res:Response)=>{
         const { id: userId } = req.params;
         if (!isValid(userId)) {
           return res.status(400).json({
             success: false,
             message: "Invalid ID Format!!",
           });
         }
         try {
            const result = await AdminService.deactivateUser(userId);
            return res.status(200).json(result)
          
         } catch (error) {
            return handleError(res,error);
         }
}