
import StudentService from "../services/studentService.js"
import { handleError } from "../helpers/handleError.js"
import { AuthRequest } from "../middlewares/authMiddleware.js"
import type { Response } from "express"
import { isValid } from "../utils/validMongodbId.js"
import RegistrationService from "../services/registrationService.js"
import InterestService from "../services/interestService.js"
import AttendanceService from "../services/attendanceService.js"
import EventService from "../services/eventService.js"
import AppError from "../utils/appError.js"
export const getAllStudentEventsHandler = async (req: AuthRequest, res:Response)=>{
         const {id: studentId} = req.userAccessInfo
          if(!isValid(studentId)){
             return res.status(400).json({
                success: false,
                message: "Invalid ID Format!!"
             })
          }
     try {
          const [
            registeredEvents,
            interestedEvents,
            attendedEvents,
            popularEvents,
          ] = await Promise.all([
            RegistrationService.getAllStudentRegisteredEvents(studentId),
            InterestService.getAllStudentInterestedEvents(studentId),
            AttendanceService.getStudentAttendedEvents(studentId),
            EventService.getPopularEvents(),
          ]);
          if (
            !registeredEvents ||
            !interestedEvents ||
            !attendedEvents ||
            !popularEvents
          ) {
            throw new AppError("Failed to retrieve your event data", 500);
          }
          return res.status(200).json({
            success: true,
            message: "Your Events Retrieved Successfully!",
            popularEvents: popularEvents,
            registeredEvents: registeredEvents,
            interestedEvents: interestedEvents,
            previouslyAttendedEvents: attendedEvents,
          });
     } catch (error) {
       return  handleError(res,error)
     }
}

export const getStudentCalendarHandler = async (req:AuthRequest, res:Response)=>{
          const {id: studentId} = req.userAccessInfo
          const { month, year } = req.query;
          if(!isValid(studentId)){
            return res.status(400).json({
               success: false,
               message: "Invalid ID Format!"
            })
          }
         const selectedMonth = parseInt(month as string) || new Date().getMonth() + 1;
         const selectedYear = parseInt(year as string) || new Date().getFullYear();
     try {
        const result = await StudentService.getStudentCalendarData(studentId,selectedMonth,selectedYear);
        return res.status(200).json(result);
     } catch (error) {
      return handleError(res,error);
     }
}


