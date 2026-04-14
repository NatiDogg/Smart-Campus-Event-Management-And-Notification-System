import { handleError } from "../helpers/handleError.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Response } from "express";
import { feedbackSchema } from "../utils/zodFeedbackValidator.js";
import { isValid } from "../utils/validMongodbId.js";
import feedbackService from "../services/feedbackService.js";

export const submitFeedbackHandler = async(req:AuthRequest<{id: string}>, res:Response)=>{

    const {id: studentId} = req.userAccessInfo
    const {id: eventId} = req.params
    const parsed = feedbackSchema.safeParse(req.body);
     if(!isValid(studentId) || !isValid(eventId)){
        return res.status(400).json({
            success: false,
            message: "Invalid ID Format!"
        })
     }
     if(!parsed.success){
        return res.status(400).json({
            success: false,
            message: parsed.error.flatten()
        })
     }
      try {
         const result = await feedbackService.submitFeedback(parsed.data,studentId, eventId);
         return res.status(201).json(result);
      } catch (error) {
        return handleError(res,error)
      }
}  