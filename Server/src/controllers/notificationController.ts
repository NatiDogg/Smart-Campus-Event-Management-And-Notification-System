
import { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Response } from "express";
import { handleError } from "../helpers/handleError.js";
import { isValid } from "../utils/validMongodbId.js";
import NotificationService from "../services/notificationService.js";

export const getNotificationsHandler = async (req:AuthRequest,res: Response)=>{
       const {id: userId} = req.userAccessInfo
       if (!isValid(userId)) {
         return res.status(400).json({
           success: false,
           message: "Invalid ID Format!!",
         });
       }
      try {
         const result = await NotificationService.getUserNotifications(userId);
         return res.status(200).json(result);
         

      } catch (error) {
         return handleError(res,error)
      }
}
export const removeNotificationHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{
        const {id: userId} = req.userAccessInfo
        const {id: notificationId} = req.params
        if(!isValid(userId) || !isValid(notificationId)){
            return res.status(400).json({
                success:false,
                message: "Invalid ID Format!"
            })
        }
         try {
            const result = await NotificationService.deleteUserNotification(userId,notificationId)
            return res.status(200).json(result)
         } catch (error) {
             return handleError(res,error)
         }
}