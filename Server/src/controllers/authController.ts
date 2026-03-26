import type { Request, Response } from "express";
import AppError from "../utils/appError.js";
import { authRegisterSchema,authLoginSchema } from "../utils/zodAuthValidator.js";
import AuthService from "../services/authService.js";
import { env } from "../utils/zodEnvFilesValidator.js";
import { handleError } from "../helpers/handleError.js";
    
const isProd = env.NODE_ENV === 'production'

const setResponseCookies = (res:Response, token: string)=>{
     res.cookie("refreshToken",token,{
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
        
    })
}

export const signInHandler = async(req: Request, res:Response)=>{
         const parsed = authRegisterSchema.safeParse(req.body);
         if(!parsed.success){
             const fieldErrors = parsed.error.flatten().fieldErrors;
             const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
             const errorMessage = fieldErrors[firstErrorKey]?.[0] || "Invalid input data";
            return res.status(400).json({
                success:false,
                message: errorMessage
            })
         }
        try {
             
             
            const result = await AuthService.signIn(parsed.data);
             const {refreshToken} = result
         
             setResponseCookies(res,refreshToken);
             return res.status(201).json({
                success: result.success,
                message: result.message,
                user: result.user,
                accessToken: result.accessToken
             })
            
            
            
        } catch (error) {
           return handleError(res,error);
        }


}


export const loginHandler = async(req:Request, res:Response)=>{
         const parsed = authLoginSchema.safeParse(req.body);

         if(!parsed.success){
             const fieldErrors = parsed.error.flatten().fieldErrors;
             const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
             const errorMessage = fieldErrors[firstErrorKey]?.[0] || "Invalid input data";
            return res.status(400).json({
                success:false,
                message: errorMessage

            })
         }
        
        try {
            const result = await AuthService.login(parsed.data)
             const {refreshToken} = result
         
              setResponseCookies(res,refreshToken);

             return res.status(200).json({
                success: result.success,
                message: result.message,
                user: result.user,
                accessToken: result.accessToken
             })

            
        } catch (error) {
            return handleError(res,error);
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
         
              setResponseCookies(res,refreshToken);

             return res.status(200).json({
                success: result.success,
                message: result.message,
                user: result.user,
                accessToken: result.accessToken
             })

        
       } catch (error) {
         return handleError(res,error);
       } 
}

export const logOutHandler = async(req:Request, res:Response)=>{
           try {
             res.clearCookie("refreshToken", {path: '/'});
             return res.status(200).json({
                success:true,
                message: "Logged Out Successfully!"
             })
            
           } catch (error) {
              return handleError(res,error);
           }
}