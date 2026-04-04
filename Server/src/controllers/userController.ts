import type { Response,Request } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import AppError from "../utils/appError.js";
import UserService from "../services/userService.js";
import { handleError } from "../helpers/handleError.js";
import { updateProfileValidator } from "../utils/zodUpdateValidator.js";
import { isValid } from "../utils/validMongodbId.js";
import AuditService from "../services/auditService.js";

export const handleRegisterToken = async(req: AuthRequest, res: Response)=>{
       const {id: userId} = req.userAccessInfo
       const {token} = req.body
       if(!token){
        return res.status(400).json({ success: false, message: "Token is required" });
       }
      try {
         const result = await UserService.addFcmToken(userId, token);
         res.status(200).json(result);
      } catch (error) {
         return handleError(res,error)
      }
}
export const handleRemoveToken = async(req: AuthRequest, res: Response)=>{
       const {id: userId} = req.userAccessInfo
       const {token} = req.body
       if(!token){
        return res.status(400).json({ success: false, message: "Token is required" });
       }
      try {
         const result = await UserService.removeFcmToken(userId, token);
         res.status(200).json(result);
      } catch (error) {
        return handleError(res,error)
      }
}

export const handleProfileUpdate = async (req:AuthRequest, res:Response)=>{
          const {id:userId, role} = req.userAccessInfo
          const parsed = updateProfileValidator.safeParse({...req.body, role})
 
          if(!isValid(userId)){
             return  res.status(400).json({
               success:false,
               message: "Invalid ID Format!!"
            })
          }
          if(!parsed.success){
            const fieldErrors = parsed.error.flatten().fieldErrors
            const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
           const errorMessage = fieldErrors[firstErrorKey]?.[0] || "Invalid input data";
            return res.status(400).json({
               success:false,
               message: errorMessage
            })
          }
      try {
         const result = await UserService.updateProfile(userId,parsed.data,role);
         void AuditService.logAction(userId, "UPDATED_PROFILE","user",result.updatedUser._id.toString())
         return res.status(200).json(result)
         
      } catch (error) {
         handleError(res,error);
      }
}







