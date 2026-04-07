
import { handleError } from "../helpers/handleError.js"
import { AuthRequest } from "../middlewares/authMiddleware.js"
import type { Response } from "express"
import { isValid } from "../utils/validMongodbId.js"
import { subscriptionSchema } from "../utils/zodSubscriptionValidator.js"
import SubscriptionService from "../services/subscriptionService.js"

export const subscribeToCategoryHandler = async(req:AuthRequest, res:Response)=>{
        const {id: studentId} = req.userAccessInfo
        if(!isValid(studentId)){
            return res.status(400).json({
                success:false,
                message: "Invalid Id Format"
            })
        }
        
        const parsed = subscriptionSchema.safeParse(req.body);
        
        if (!parsed.success) {
          return res.status(400).json({
            success: false,
            message: "Invalid input data",
            errors: parsed.error.flatten()
          });
        }
        
      try {
         const result = await SubscriptionService.subscribeToCategory(studentId,parsed.data.categories);
         return res.status(201).json(result)
      } catch (error) {
         return handleError(res,error)
      }
}
export const getAllSubscriptionHandler = async(req:AuthRequest, res:Response)=>{
         const {id: studentId} = req.userAccessInfo
         if(!isValid(studentId)){
            return res.status(400).json({
                success:false,
                message: "Invalid Id Format"
            })
        }
       try {
           const result = await SubscriptionService.getStudentSubscription(studentId);
           return res.status(200).json(result);
       } catch (error) {
        return handleError(res,error)
       }
}