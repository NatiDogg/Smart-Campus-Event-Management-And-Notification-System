import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthRequest<P = any, ResBody = any, ReqBody = any,ReqQuery = any > extends Request<P, ResBody, ReqBody, ReqQuery>{
     userAccessInfo:{
         id: string,
     email: string,
     role: 'student' | "admin" | "organizer"
     }
}
export const authUser = (req:AuthRequest, res:Response,next:NextFunction)=>{
       const authHeader = req.headers?.authorization;
       if(!authHeader || !authHeader.startsWith("Bearer ")){
           return res.status(401).json({
              success:false,
              message: "Unauthorized Access!"
           })
       }
      try {
         const token = authHeader.split(" ")[1];
          if(!token){
             return res.status(401).json({
                 success: false,
                 message: 'Unauthorized Access!'
             })
          }
          const userInfo = verifyAccessToken(token);
          req.userAccessInfo = userInfo
           return next();

         
      } catch (error) {
         console.log(error)
         return res.status(401).json({
            success:false,
            message: "Invalid or expired token!"
        })
      }
}




