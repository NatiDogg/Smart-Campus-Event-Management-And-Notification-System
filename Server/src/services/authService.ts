import { createNewStudent } from "../repositories/studentRepository.js";
import AppError from "../utils/appError.js";
import { hashPassword,matchPassword } from "../utils/bcryptjs.js";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { authUserRegisterType,authUserLoginType } from "../utils/zodAuthValidator.js";
import { env } from "../utils/zodEnvFilesValidator.js";
import { createNewAdmin } from "../repositories/adminRepository.js";

import UserService from "./userService.js";
class AuthService{
       async signIn(userData: authUserRegisterType){
         const normalizedEmail = userData.email.toLowerCase();

         const user = await UserService.findUserByEmail(normalizedEmail);
          if(user){
            throw new AppError("User Already Registered!",400);

          }
          
          
          const hashedPassword = await hashPassword(userData.password);

          if(!hashedPassword){
            throw new AppError("Something went wrong storing your password! please try again",400);
          }
          const newlyCreatedStudent = await createNewStudent({
              ...userData,
              email: normalizedEmail,
              password: hashedPassword
          })

          if(!newlyCreatedStudent){
            throw new AppError("Cant Register right now! please try again",400);
          }

          return this.generateTokenResponse(newlyCreatedStudent,"Registered Successfully!");
        
       }

       async login(userData:authUserLoginType){
         const normalizedEmail = userData.email.toLowerCase();
         if(normalizedEmail === env.ADMIN_EMAIL && userData.password === env.ADMIN_PASS){
             const admin = await UserService.findUserByEmail(normalizedEmail);
             if(!admin){
                 const hashedPassword = await hashPassword(userData.password);
                 const newlyCreatedAdmin = await createNewAdmin({
                   ...userData,
                   password: hashedPassword,
                   fullName: "System Admin",
                 
                 });
                 if (!newlyCreatedAdmin) {
                   throw new AppError("System initialization failed!", 500);
                 }
      
                return this.generateTokenResponse(
                  newlyCreatedAdmin,
                   "User Logged In Successfully!"
                );
             }
         }
         const user = await UserService.findUserByEmail(normalizedEmail);


         if(!user){
          throw new AppError("Invalid Credentials!",401);
         }
        
         const isPasswordCorrect = await matchPassword(userData.password, user.password);

         if(!isPasswordCorrect){
          throw new AppError("Invalid Credentials!",401);
         }

         return this.generateTokenResponse(user,"Logged In Successfully!");

     
       }

       async handleRefreshToken(token:string){
           const {id} = verifyRefreshToken(token);
           if(!id){
             throw new AppError("Token Verification Failed!",401);
           }
           const user = await UserService.findUserById(id)

           if(!user){
             throw new AppError("User not Found!",401);
           }

           return this.generateTokenResponse(user,"Refresh Token Issued Successfully!")
           

       }




       private generateTokenResponse(user:any, message: string){
            
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role

        }

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

         const userInfo = user.toObject();
         delete userInfo.password;

         return {
            success: true,
            message: message,
            user: userInfo,
            accessToken,
            refreshToken
         }

       }
}


export default new AuthService();