import type { Request, Response } from "express";
import AppError from "../utils/appError.js";
import { authRegisterSchema,authLoginSchema } from "../utils/zodAuthValidator.js";
import AuthService from "../services/authService.js";
import { env } from "../utils/zodEnvFilesValidator.js";
import { handleError } from "../helpers/handleError.js";
import UserService from "../services/userService.js";
import { forgetPasswordSchema, resetPasswordSchema } from "../utils/zodResetPasswordValidator.js";
import crypto from 'crypto'
import NotificationService from "../services/notificationService.js";
import { hashPassword } from "../utils/bcryptjs.js";
    
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
                message: "Logged out Successfully!"
             })
            
           } catch (error) {
              return handleError(res,error);
           }
}

export const googleAuthHandler = async(req:Request, res:Response)=>{
       
      try {
         const url = await AuthService.SignUserWithGoogleUrl()
         return res.redirect(url);
      } catch (error) {
         return handleError(res,error)
      }
}
export const googleAuthCallbackHandler = async(req:Request<{},{},{},{code: string}>, res:Response)=>{
      const {code} = req.query
       if(!code){
         res.redirect(`${env.VITE_FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed`);
       }
     try { 
         const result = await AuthService.signUserWithGoogle(code)
         const {refreshToken,accessToken} = result
         setResponseCookies(res,refreshToken)
          const frontendUrl = env.VITE_FRONTEND_URL || "http://localhost:5173";
          return res.redirect(`${frontendUrl}/auth/success?token=${accessToken}`)
     } catch (error) {
      console.error("Google Auth Error:", error);
       return res.redirect(`${env.VITE_FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed`);
     }
}

export const getMeHandler = async(req:Request<{token: string}>, res:Response)=>{
    const {token}= req.params
  
     if(!token){
      return res.status(400).json({
         success: false,
         message: "Login Failed!"
      })
     }
    try {
        const result = await UserService.verifyUser(token);
        return res.status(200).json({
         success:true,
         message: 'User authenticated Successfully',
         user: result
        })
    } catch (error) {
      handleError(res,error);
    }
}

export const forgetPasswordHandler = async(req:Request, res:Response)=>{
       const parsed = forgetPasswordSchema.safeParse(req.body)
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
         const {email} = parsed.data
         const normalizedEmail = email.toLowerCase()
         const user = await UserService.findUserByEmail(normalizedEmail)
         if(!user){
            throw new AppError("User not Found!",400);
         }
         const rawToken = crypto.randomBytes(32).toString("hex")
         const tokenHash = crypto.createHash('sha256').update(rawToken).digest("hex")
         user.resetPasswordToken = tokenHash
         user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000) //15m
         await user.save()
       
          const appUrl = env.VITE_FRONTEND_URL || "http://localhost:5173"
         const resetUrl = `${appUrl}/reset-password?token=${rawToken}`
       
         void NotificationService.notifyUserPasswordReset(user.email, resetUrl)

         return res.status(200).json({
            success: true,
             message: "if an account with this email exists, we will send you a reset link"
         })

     } catch (error) {
      return handleError(res,error)
     }
}
export const resetPasswordHandler = async(req:Request, res:Response)=>{
        const parsed = resetPasswordSchema.safeParse(req.body);
         if(!parsed.success){
             const fieldErrors = parsed.error.flatten().fieldErrors
             const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
           const errorMessage = fieldErrors[firstErrorKey]?.[0] || "Invalid input data";
            return res.status(400).json({
               success:  false,
               message: errorMessage
            })
         }
    try {
         const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest("hex")
         const user = await UserService.getUserByResetToken(tokenHash)
         if(!user){
             throw new AppError("invalid or expired token",400);
         }

         const newPasswordHashed = await hashPassword(parsed.data.password)
         user.password = newPasswordHashed
         user.resetPasswordToken = null
         user.resetPasswordExpire = null
         await user.save()
         return res.status(200).json({
            success:true,
            message: "Password reset successfully!"
          })
      
    } catch (error) {
      return handleError(res,error)
    }
}