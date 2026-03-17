import { request, type Request, type Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import AppError from "../utils/appError.js";
import AdminService from "../services/adminService.js";
import { createOrganizerSchema } from "../utils/zodOrganizerValidator.js";
import { categoryCreationSchema } from "../utils/zodCategoryValidator.js";
import { Types } from "mongoose";
import { isValid } from "../utils/validMongodbId.js";
import { handleError } from "../helpers/handleError.js";
import { announcementSchema } from "../utils/zodAnnouncementValidator.js";
import CategoryService from "../services/categoryService.js";
import OrganizerService from "../services/organizerService.js";
import AnnouncementService from "../services/announcementService.js";
import EventService from "../services/eventService.js";
import UserService from "../services/userService.js";

export const createOrganizerHandler  =async(req: Request, res:Response)=>{
        const parsed = createOrganizerSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message: parsed.error.flatten()

            })
        }
        try {
            const organizer = await OrganizerService.registerNewOrganizer(parsed.data)
            return res.status(201).json({
              success: true,
              message: "Organizer Created Successfully!",
              organizer
            })
            
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
      const newCategory = await CategoryService.registerNewCategory(parsed.data);
      return res.status(201).json({
        success: true,
        message: "New Category Created Successfully",
        newCategory
      })
       
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
          const approvedEvent = await EventService.approveEvent(eventId);
          return res.status(200).json({
             success: true,
             message: "Event Approved Successfully",
             approvedEvent
          });
         
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
         const rejectedEvent = await EventService.rejectEvent(eventId);
          return res.status(200).json({
            success: true,
            message: "Event Rejected Successfully",
             rejectedEvent
          });
         
      } catch (error) {
         return handleError(res,error);
      }
}
export const getAllEventsHandler = async(req:Request, res:Response)=>{
        try {
           const events = await EventService.getAllAdminEvents()
           return res.status(200).json({
            success: true,
            message: "Events Retreived Successfully",
            events
           })
        } catch (error) {
           return handleError(res,error);
        }

}

export const getAllUsersHandler = async(req:Request, res:Response)=>{
        try {
           const users = await UserService.getUsers();
           return res.status(200).json({
            success: true,
            message: "All Users Retreived Successfully!",
            users
           })
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
            const deactivatedUser = await UserService.deactivateUser(userId)
            return res.status(200).json({
              success: true,
              message: "User Deactivated Successfully",
              deactivatedUser
            })
          
         } catch (error) {
            return handleError(res,error);
         }
}
export const createAnnouncementHandler = async(req:Request, res:Response)=>{
          const parsed = announcementSchema.safeParse(req.body);
          if(!parsed.success){
            return res.status(400).json({
               success:false,
               message: parsed.error.flatten()
            })
          }
          try {
            const newAnnouncement = await AnnouncementService.createAnnouncement(parsed.data);
            return res.status(201).json({
              success: true,
              message: "New Announcement Created Successfully!",
              newAnnouncement
            });
          } catch (error) {
           return  handleError(res,error)
          }
} 
export const getPendingEventsHandler = async(req:Request, res:Response)=>{
     try {
        const events = await EventService.getPendingEvents()
        res.status(200).json({
          success: true,
          message: events.length > 0 ? "Pending Events Retrieved Successfully!" : "No pending events yet",
          events
        })
        
     } catch (error) {
        return handleError(res,error);
     }
}