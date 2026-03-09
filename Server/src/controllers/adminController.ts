import type { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import AppError from "../utils/appError.js";
import AdminService from "../services/adminService.js";
import { createOrganizerSchema } from "../utils/zodOrganizerValidator.js";
import { categoryCreationSchema } from "../utils/zodCategoryValidator.js";


export const createOrganizerHandler  =async(req: Request, res:Response)=>{
        const parsed = createOrganizerSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message: parsed.error.flatten()

            })
        }
        try {
            const result = await AdminService.createOrganizer(parsed.data)
            return res.status(201).json(result)
            
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

export const createNewCategoryHandler = async(req:Request, res:Response)=>{
       const parsed = categoryCreationSchema.safeParse(req.body)
       if(!parsed.success){
         return res.status(400).json({
          success:false,
          message: parsed.error.flatten()
         })
       }
     try {
      const result = await AdminService.createNewCategory(parsed.data)
      return res.status(201).json(result)
       
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