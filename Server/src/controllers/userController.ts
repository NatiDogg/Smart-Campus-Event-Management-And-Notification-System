import type { Response,Request } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import AppError from "../utils/appError.js";
import UserService from "../services/userService.js";
import { handleError } from "../helpers/handleError.js";


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






