
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



