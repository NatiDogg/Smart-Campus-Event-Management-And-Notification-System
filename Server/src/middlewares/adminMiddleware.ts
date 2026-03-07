import type {  Response,NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";


export const isAdmin = (req:AuthRequest, res:Response, next: NextFunction)=>{
           const userInfo = req.userAccessInfo
            if(!userInfo){
                return res.status(401).json({
                    success:false,
                    message: "Unauthorized Access!"
                })
            }
           try {

             if(userInfo.role !== "admin"){
                 return  res.status(403).json({
                    success:false,
                    message: "Admin access required!"
                })
             }
              return next();
            
            
              
            
           } catch (error) {
               return res.status(401).json({
                    success:false,
                    message: "Invalid or expired token!"
               })
           }
}