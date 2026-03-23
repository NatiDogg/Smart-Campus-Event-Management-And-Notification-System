import { request, type Request, type Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { createOrganizerSchema } from "../utils/zodOrganizerValidator.js";
import { categoryCreationSchema } from "../utils/zodCategoryValidator.js";
import { isValid } from "../utils/validMongodbId.js";
import { handleError } from "../helpers/handleError.js";
import { announcementSchema } from "../utils/zodAnnouncementValidator.js";
import CategoryService from "../services/categoryService.js";
import OrganizerService from "../services/organizerService.js";
import AnnouncementService from "../services/announcementService.js";
import EventService from "../services/eventService.js";
import UserService from "../services/userService.js";
import RegistrationService from "../services/registrationService.js";
import AuditService from "../services/auditService.js";
import AttendanceService from "../services/attendanceService.js";

export const createOrganizerHandler  =async(req: AuthRequest, res:Response)=>{
        const parsed = createOrganizerSchema.safeParse(req.body);
        const {id: adminId} = req.userAccessInfo
        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message: parsed.error.flatten()

            })
        }
        try {
            const organizer = await OrganizerService.registerNewOrganizer(parsed.data);
             void AuditService.logAction(adminId, "ORGANIZER_REGISTERED", "user", organizer._id.toString());
            return res.status(201).json({
              success: true,
              message: "Organizer Created Successfully!",
              organizer
            })
            
        } catch (error) {
            return handleError(res,error);
        }
}

export const createNewCategoryHandler = async(req:AuthRequest, res:Response)=>{
       const parsed = categoryCreationSchema.safeParse(req.body)
       const {id: adminId} = req.userAccessInfo
       if(!parsed.success){
         return res.status(400).json({
          success:false,
          message: parsed.error.flatten()
         })
       }
     try {
      const newCategory = await CategoryService.registerNewCategory(parsed.data);
      void AuditService.logAction(adminId, "CREATED_CATEGORY", "category", newCategory._id.toString());
      return res.status(201).json({
        success: true,
        message: "New Category Created Successfully",
        newCategory
      })
       
     } catch (error) {
         return handleError(res,error);
     }
}

export const approveEventHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
        const {id: eventId} = req.params
        const {id : adminId} = req.userAccessInfo
        if(!isValid(eventId)){
          return res.status(400).json({
            success: false,
            message: "Invalid ID Format!!"
          })
        }
      try {
          const approvedEvent = await EventService.approveEvent(eventId);
          void AuditService.logAction(adminId,"APPROVED_EVENT","event",eventId);
          return res.status(200).json({
             success: true,
             message: "Event Approved Successfully",
             approvedEvent
          });
         
      } catch (error) {
         return handleError(res,error);
      }
}
export const rejectEventHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
         const { id: eventId } = req.params;
         const {id: adminId} = req.userAccessInfo
         if (!isValid(eventId)) {
           return res.status(400).json({
             success: false,
             message: "Invalid ID Format!!",
           });
         }
    
      try {
         const rejectedEvent = await EventService.rejectEvent(eventId);
         void AuditService.logAction(adminId,"REJECTED_EVENT","event",eventId)
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
export const deactivateUserHandler = async(req:AuthRequest<{id:string}>, res:Response)=>{
         const { id: userId } = req.params;
         const {id: adminId} = req.userAccessInfo
         if (!isValid(userId)) {
           return res.status(400).json({
             success: false,
             message: "Invalid ID Format!!",
           });
         }
         try {
            const deactivatedUser = await UserService.deactivateUser(userId)
            void AuditService.logAction(adminId,"DEACTIVATED_USER","user",deactivatedUser._id.toString())
            return res.status(200).json({
              success: true,
              message: "User Deactivated Successfully",
              deactivatedUser
            })
          
         } catch (error) {
            return handleError(res,error);
         }
}
export const createAnnouncementHandler = async(req:AuthRequest, res:Response)=>{
          const parsed = announcementSchema.safeParse(req.body);
          const {id: adminId} = req.userAccessInfo
          if(!parsed.success){
            return res.status(400).json({
               success:false,
               message: parsed.error.flatten()
            })
          }
          try {
            const newAnnouncement = await AnnouncementService.createAnnouncement(parsed.data);
            void AuditService.logAction(adminId,"CREATED_ANNOUNCEMENT","announcement", newAnnouncement._id.toString())
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
export const getAdminDashboardDataHandler = async(req:Request, res:Response)=>{
       try {
          const [activeUsers,activeEvents,pendingEvents,categoryDistribution,attendanceTrend] = await Promise.all([
              UserService.getUsers(),
              EventService.getAdminActiveEvents(),
              EventService.getPendingEvents(),
              RegistrationService.getAllRegistrationStatsByCategoryForAdmin(),
              AttendanceService.getOverallAttendanceTrends()
          ])
          return res.status(200).json({
            success: true,
            message: "Admin Dashboard Retrieved Successfully!",
            activeUsers: activeUsers.length,
            activeEvents: activeEvents,
            pendingEvents: pendingEvents.length,
            categoryDistribution: categoryDistribution,
            attendanceTrend: attendanceTrend
          })
       } catch (error) {
         return handleError(res,error)
       }
}  

export const getAllCategoriesHandler = async(req:Request, res:Response)=>{
     try {
       const categories = await CategoryService.findAllAdminCategories()
       return res.status(200).json({
        success: true,
        message: "Categories Fetched Successfully!",
        categories
       })
     } catch (error) {
      handleError(res,error)
     }
}

export const getAllAuditLogsHandler = async(req: Request, res:Response)=>{
     try {
        const result = await AuditService.getAuditLogs()
        return res.status(200).json({
          success: true,
          message: "Audit Logs Retrieved Successfully!",
          result
        })
     } catch (error) {
      return handleError(res,error)
     }
}