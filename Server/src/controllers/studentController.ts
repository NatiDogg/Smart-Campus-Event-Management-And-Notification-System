
import StudentService from "../services/studentService.js"
import { handleError } from "../helpers/handleError.js"
import { AuthRequest } from "../middlewares/authMiddleware.js"
import type { Response } from "express"
import { isValid } from "../utils/validMongodbId.js"
export const getAllStudentEventsHandler = async (req: AuthRequest, res:Response)=>{
         const {id: studentId} = req.userAccessInfo
          if(!isValid(studentId)){
             return res.status(400).json({
                success: false,
                message: "Invalid ID Format!!"
             })
          }
     try {
          const result = await StudentService.getStudentEvents(studentId);
          return res.status(200).json(result);
     } catch (error) {
       return  handleError(res,error)
     }
}
export const getAnnouncementsHandler = async(req:AuthRequest, res:Response)=>{
     try {
        const result = await StudentService.getStudentAnnouncement()
        return res.status(200).json(result);
     } catch (error) {
       return handleError(res,error)
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


