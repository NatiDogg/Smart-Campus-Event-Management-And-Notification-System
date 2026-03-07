import type { Response,NextFunction } from "express";

import { AuthRequest } from "./authMiddleware.js";
export const isOrganizer = (req:AuthRequest, res:Response,next: NextFunction)=>{
          const userInfo = req.userAccessInfo
            if(!userInfo){
                return res.status(401).json({
                    success:false,
                    message: "Unauthorized Access!"
                })
            }
       try {
          
          if(userInfo.role !== "organizer"){
               return res.status(403).json({
                success:false,
                message: 'Organizer access required!'
            })
          }
          return next();
          
        
       } catch (error) {
          res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
          })
       }

}