import { AuthRequest } from '../middlewares/authMiddleware.js'
import AppError from '../utils/appError.js'
import type {Request, Response} from 'express'
import { isValid } from '../utils/validMongodbId.js'
import RegistrationService from '../services/registrationService.js'
import { handleError } from '../helpers/handleError.js'
import AIService from '../services/aiService.js'


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
            void AIService.refreshStudentRecommendations(studentId);
            return res.status(201).json(result);

            
          } catch (error) {
           return handleError(res,error);
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
        void AIService.refreshStudentRecommendations(studentId);
        res.status(200).json(result)
        
     } catch (error) {
        return handleError(res,error);
     }
}

