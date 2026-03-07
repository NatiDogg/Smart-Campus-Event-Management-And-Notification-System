import type { Request, Response } from "express";
import AppError from "../utils/appError.js";
import { authRegisterSchema,authLoginSchema } from "../utils/zodAuthValidator.js";
import AuthService from "../services/authService.js";
import { env } from "../utils/zodEnvFilesValidator.js";
    
const isProd = env.NODE_ENV === 'production'
export const signInHandler = async(req: Request, res:Response)=>{
         const parsed = authRegisterSchema.safeParse(req.body);
         if(!parsed.success){
            return res.status(400).json({
                success:false,
                message: parsed.error.flatten()
            })
         }
        try {
             

            const result = await AuthService.signIn(parsed.data);
             const {refreshToken} = result
         
             res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                sameSite: "lax",
                secure: isProd,
                maxAge: 7 * 24 * 60 * 60 * 1000
             });
             return res.status(201).json({
                success: result.success,
                message: result.message,
                user: result.user,
                accessToken: result.accessToken
             })
            
            
            
        } catch (error) {
            if(error instanceof AppError){
                return res.status(error.statusCode).json({
                    success:false,
                    message: error.message
                })
            }

            return res.status(500).json({
                success:false,
                message: "Internal Server Error"
            })
        }


}


export const loginHandler = async(req:Request, res:Response)=>{
         const parsed = authLoginSchema.safeParse(req.body);

         if(!parsed.success){
            return res.status(400).json({
                success:false,
                message: parsed.error.flatten()

            })
         }
        
        try {
            const result = await AuthService.login(parsed.data)
             const {refreshToken} = result
         
             res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                sameSite: "lax",
                secure: isProd,
                maxAge: 7 * 24 * 60 * 60 * 1000
             });
             return res.status(200).json({
                success: result.success,
                message: result.message,
                user: result.user,
                accessToken: result.accessToken
             })

            
        } catch (error) {
            if(error instanceof AppError){
                return res.status(error.statusCode).json({
                    success:false,
                    message: error.message
                })
            }

            return res.status(500).json({
                success:false,
                message: "Internal Server Error"
            })
        }
}

export const refreshTokenHandler = async(req:Request, res:Response)=>{
        const token = req.cookies?.refreshToken as string | undefined
         if(!token){
           return res.status(400).json({
                success:false,
                message: "refresh token is missing!"
            })
         }
       try {

           const result = await AuthService.handleRefreshToken(token)
           const {refreshToken} = result
         
             res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                sameSite: "lax",
                secure: isProd,
                maxAge: 7 * 24 * 60 * 60 * 1000
             });
             return res.status(200).json({
                success: result.success,
                message: result.message,
                user: result.user,
                accessToken: result.accessToken
             })

        
       } catch (error) {
          if(error instanceof AppError){
                return res.status(error.statusCode).json({
                    success:false,
                    message: error.message
                })
            }

            return res.status(500).json({
                success:false,
                message: "Internal Server Error"
            })
       } 
}

export const logOutHandler = async(req:Request, res:Response)=>{
           try {
             res.clearCookie("refreshToken");
             return res.status(200).json({
                success:true,
                message: "Logged Out Successfully!"
             })
            
           } catch (error) {
              if(error instanceof AppError){
                return res.status(error.statusCode).json({
                    success:false,
                    message: error.message
                })
            }

            return res.status(500).json({
                success:false,
                message: "Internal Server Error"
            })
           }
}