import { handleError } from "../helpers/handleError.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import AnnouncementService from "../services/announcementService.js";
import AppError from "../utils/appError.js";
import type { Response } from "express";

export const getStudentAnnouncementHandler = async(req:AuthRequest, res: Response)=>{
        try {
            const announcements  = await AnnouncementService.getAnnouncements()
                     if(!announcements){
                        throw new AppError("Failed to get school announcements!",500);
                     }
                     return res.status(200).json({
                      success: true,
                      message: "Announcements retrieved Successfully!",
                      announcements
                     })
        } catch (error) {
            return handleError(res,error)
        }
}