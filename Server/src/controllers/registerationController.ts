import { AuthRequest } from '../middlewares/authMiddleware.js'
import AppError from '../utils/appError.js'
import type {Request, Response} from 'express'
import { isValid } from '../utils/validMongodbId.js'
import RegistrationService from '../services/registrationService.js'



export const registerStudentToEventHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
          const {id: studentId} = req.userAccessInfo
          const {id: eventId} = req.params

          if(!isValid(studentId) || !isValid(eventId)){
             return res.status(400).json({
                success: false,
                message: "Invalid ID Format!!"
             })
          }

          try {

            const result = await RegistrationService.RegisterStudentToEvent(studentId, eventId)
            return res.status(201).json(result);

            
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
export const unRegisterStudentToEventHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
    const {id: studentId} = req.userAccessInfo
          const {id: eventId} = req.params

          if(!isValid(studentId) || !isValid(eventId)){
             return res.status(400).json({
                success: false,
                message: "Invalid ID Format!!"
             })
          }
     try {

        const result = await RegistrationService.unRegisterStudentToEvent(studentId,eventId)
        res.status(200).json(result)
        
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