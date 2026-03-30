import type { Request, Response } from "express";
import AppError from "../utils/appError.js";
import { createEventSchema,updateEventSchema } from "../utils/zodEventValidator.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import EventService from "../services/eventService.js";
import { isValid } from "../utils/validMongodbId.js";
import { handleError } from "../helpers/handleError.js";
import FeedbackService from "../services/feedbackService.js";
import RegistrationService from "../services/registrationService.js";
import AttendanceService from "../services/attendanceService.js";
import AuditService from "../services/auditService.js";


export const createEventHandler = async(req:AuthRequest, res:Response)=>{

       const {id} = req.userAccessInfo
       const file = req.file
        const parsed = createEventSchema.safeParse(req.body);
       if(!parsed.success){
          const fieldErrors = parsed.error.flatten().fieldErrors
          const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
           const errorMessage = fieldErrors[firstErrorKey]?.[0] || "Invalid input data";
        return res.status(400).json({
            success:false,
            message: errorMessage
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
         void AuditService.logAction(id,"CREATED_EVENT","event",result.newlyCreatedEvent._id.toString())
         return res.status(201).json(result);
         
        
      } catch (error) {
        return handleError(res,error);
      }
}
export const getEventsByOrganizerHandler = async(req:AuthRequest, res:Response)=>{
        const {id} = req.userAccessInfo
      try {
          const result = await EventService.getEventsByOrganizer(id);
          return res.status(200).json(result);
      } catch (error) {
        return handleError(res,error);
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
            void AuditService.logAction(organizerId, "UPDATED_EVENT","event",result.updatedEvent._id.toString())
            return res.status(200).json(result);
            
         } catch (error) {
             return handleError(res,error);
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
        return handleError(res,error);
    }
}
export const getOrganizerFeedbacksHandler = async(req:AuthRequest, res:Response)=>{
      const {id: organizerId} = req.userAccessInfo
      if(!isValid(organizerId)){
        return res.status(400).json({
            success: false,
            message: "Invalid ID Format!"
        })
      }
      try {
        const feedbacks = await FeedbackService.getOrganizerFeedbacks(organizerId);
        return res.status(200).json({
            success: true,
            message: "Feedbacks Retrieved Successfully!",
            feedbacks
        })
      } catch (error) {
        handleError(res,error)
      }
}
export const getOrganizerDashboardHandler = async(req:AuthRequest, res:Response)=>{
        const { id: organizerId } = req.userAccessInfo;
        if (!isValid(organizerId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid ID Format!",
          });
        }
         try {
           const [activeEvents,attendedStudentCount,pendingEventsCount,averageRating] = await Promise.all([EventService.getActiveOrganizerEvents(organizerId),AttendanceService.getAllAttendedStudents(organizerId),EventService.getOrganizerPendingEventsCount(organizerId),FeedbackService.getAverageRating(organizerId)])


           return res.status(200).json({
            success: true,
            message: "Organizer Dashboard Data Fetched Successfully!",
            activeEvents: activeEvents,
            ActiveEventsLength: activeEvents.length,
            attendanceCount: attendedStudentCount,
            pendingEventsCount: pendingEventsCount,
            averageRating: averageRating
           })
            
         } catch (error) {
           return handleError(res,error)
         }
}
export const getOrganizerAnalytics = async(req:AuthRequest, res: Response)=>{
         const {id: organizerId} = req.userAccessInfo

         if(!isValid(organizerId)){
          return res.status(400).json({
            success: false,
            message: "Invalid ID Format!"
          })
         }
        try {
            const [totalEngagement,approvalRate,attendanceTrends,categoryDemographics] = await Promise.all([
               RegistrationService.getAllEventRegistrationForOrganizer(organizerId),
               EventService.getOrgnanizerApprovalAnalytics(organizerId),
               AttendanceService.getOverallOrganizerAttendanceTrends(organizerId),
               RegistrationService.getAllCategoryDemographicsForOrganizer(organizerId)
            ])

            return res.status(200).json({
              success: true,
              message: "Organizer Analytics Fetched Successfully!",
              totalEngagement: totalEngagement,
              approvalStat: approvalRate,
              attendanceTrends: attendanceTrends,
              categoryDemographics: categoryDemographics
            })
        } catch (error) {
          return handleError(res,error);
        }
}




export const getRegisteredStudentsForEventHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
         const {id: organizerId} = req.userAccessInfo
         const {id: eventId} = req.params
          if (!isValid(organizerId) || !isValid(eventId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid ID Format!",
          });
        }
     try {
        const event = await EventService.getEventById(eventId);
        if(!event || event.organizedBy.toString() !== organizerId){
          throw new AppError("You do not have permission to view this event's attendance.", 403);
        }
        const [registrations,attendanceRecords] = await Promise.all([RegistrationService.getStudentsRegistrationStatus(eventId), AttendanceService.getAttendanceSheetForEvent(eventId)])
        if(!registrations){
          throw new AppError("Failed to get Registered Students!",500)
        }

        const registeredStudent = registrations.map(reg=>{
          const attendance = attendanceRecords.find(
            att => att.studentId.toString() === reg.studentId._id.toString()
        );
         return {
            student: reg.studentId,
            isPresent: attendance ? attendance.isPresent : false,
            attendanceId: attendance ? attendance._id : null
         };
        })
        return res.status(200).json({
          success: true,
          message: "Registered Student Fetched Successfully!",
          registeredStudent
        }) 
         
        
     } catch (error) {
       return handleError(res,error)
     }
}

export const markStudentAttendanceHandler = async(req: AuthRequest<{id: string}>, res: Response)=>{
       const { id: eventId } = req.params;
       const { id: organizerId } = req.userAccessInfo;
       const { studentId, isPresent } = req.body;
       if (!isValid(eventId) || !isValid(studentId)) {
         return res.status(400).json({ success: false, message: "Invalid ID Format" });
       }
        try {
            const event = await EventService.getEventById(eventId);
        if(!event || event.organizedBy.toString() !== organizerId){
          throw new AppError("Unauthorized: You do not own this event", 403);
        }
         const record = await AttendanceService.takeAttendance(studentId,eventId,organizerId,isPresent)
         return res.status(200).json({
             success: true,
            message: `Attendance marked as ${isPresent ? 'Present' : 'Absent'}`,
            record 
         })
        } catch (error) {
           return handleError(res,error)
        }
}