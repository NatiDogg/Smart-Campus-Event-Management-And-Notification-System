
import AppError from "../utils/appError.js";
import { hashPassword,matchPassword } from "../utils/bcryptjs.js";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { authUserRegisterType,authUserLoginType } from "../utils/zodAuthValidator.js";
import { env } from "../utils/zodEnvFilesValidator.js";
import UserService from "./userService.js";
import StudentService from "./studentService.js";
import AdminService from "./adminService.js";
import {OAuth2Client} from 'google-auth-library'
import crypto from 'crypto'

const getGoogleClient = ()=>{
      const clientId = env.GOOGLE_CLIENT_ID
      const clientSecret = env.GOOGLE_CLIENT_SECRET
      const redirectUri = env.GOOGLE_REDIRECT_URI

      return new OAuth2Client({
          clientId,
          clientSecret,
          redirectUri
      })
}
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
          const newlyCreatedStudent = await StudentService.createNewStudent({
              ...userData,
              email: normalizedEmail,
              password: hashedPassword
          })

          if(!newlyCreatedStudent){
            throw new AppError("Cant Register right now! please try again",400);
          }

          return this.generateTokenResponse(newlyCreatedStudent,"Registered Successfully!");
        
       }
       async SignUserWithGoogleUrl(){
           const client = getGoogleClient()
           const url = client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ["openid", "email", "profile"]
           });
           return url;
       }
       async signUserWithGoogle(code: string){
          const client = getGoogleClient()
          const {tokens} = await client.getToken(code)
          if(!tokens.id_token){
             throw new AppError("no id token is present!", 400);
          }
          const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: env.GOOGLE_CLIENT_ID
          })
          const payload = ticket.getPayload()
          if(!payload){
              throw new AppError("Sign In with Google Failed! please try again", 409);
          }
          const email = payload.email;
          const emailVerified = payload?.email_verified;
          if(!email || !emailVerified){
             throw new Error("Google email account is not verified");
          }
          const normalizedEmail = email.toLowerCase()
          let user = await UserService.findUserByEmail(normalizedEmail)
          if(user){
            return this.generateTokenResponse(user,"Logged in successfully!");
          }
          const randomPassword = crypto.randomBytes(16).toString("hex")
          const hashedPassword = await hashPassword(randomPassword)
          const fullName = payload.name
          const yearSuffix = new Date().getFullYear().toString().slice(-2);
          const randomNumber = crypto.randomInt(1000, 10000);
          const prefix = "UGR";
          const uniqueStudentId = `${prefix}/${randomNumber}/${yearSuffix}`;
          user = await StudentService.createNewStudent({
             fullName: fullName!,
             studentId: uniqueStudentId,
             email: email,
             password: hashedPassword,
             profile: payload.picture!,
             provider: 'google'
          })

          if(!user){
             throw new AppError( "cant signin with google right now please try again!",400);
          }
          return this.generateTokenResponse(user,"Account Created Successfully")
          
       }

       async login(userData:authUserLoginType){
         const normalizedEmail = userData.email.toLowerCase();
         if(normalizedEmail === env.ADMIN_EMAIL && userData.password === env.ADMIN_PASS){
             const admin = await UserService.findUserByEmail(normalizedEmail);
             if(!admin){
                 const hashedPassword = await hashPassword(userData.password);
                 const newlyCreatedAdmin = await AdminService.createNewAdmin({
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