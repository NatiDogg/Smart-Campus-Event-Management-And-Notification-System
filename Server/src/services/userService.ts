import { Types } from "mongoose";
import adminModel from "../models/adminModel.js";
import organizerModel from "../models/organizerModel.js";
import studentModel from "../models/studentModel.js";
import userModel from "../models/userModel.js";
import { getAll,findById,findByEmail, deleteUser, updateFcmToken, removeToken, findAllStudents } from "../repositories/userRepository.js";
import AppError from "../utils/appError.js";
import { hashPassword } from "../utils/bcryptjs.js";
import { UpdateProfileInput } from "../utils/zodUpdateValidator.js";
import { verifyAccessToken } from "../utils/jwt.js";



class UserService{
    async verifyUser(token: string){
        const decodedToken = verifyAccessToken(token)
        if(!decodedToken){
            throw new AppError("Failed verifying user",400)
        }
        const {id} = decodedToken
        const user = await findById(id).select('-password').lean();
        if (!user) {
        throw new AppError("User no longer exists", 404);
        }
        return user;

    }
    async getUsers(){
      const users = await getAll();
       if(!users){
        throw new AppError("Failed to get Users",500);
       }
      return users;
    }
    async getAllStudents(){
        const students = await findAllStudents();
        return students;
    }
    async findUserById(id: string){
        const user = await findById(id);
        return user;
    }
    async findUserByEmail(email: string){
        const user = await findByEmail(email)
        return user;
    }
    async deactivateUser(userId: string){
       const deactivatedUser = await deleteUser(userId)
        if(!deactivatedUser){
            throw new AppError("Failed to deactivate user",500);
        }
       return deactivatedUser
    }
    async addFcmToken(userId: string, newToken: string){
        const addedToken = await updateFcmToken(userId, newToken)
        if(!addedToken){
            throw new AppError("cant save FCM token right now!",400)
        }
        
        return {
          success: true,
          message: "Push notification token updated successfully"
     }
    }
    async removeFcmToken(userId: string, staleToken: string[]) { 
       const removedToken = await removeToken(userId, staleToken)
       if(!removedToken){
            throw new AppError("Failed to remove FCM token right now!",400)
        }
        
        return {
          success: true,
          message: "Push notification token removed successfully"
        }
    }
    async updateProfile(userId:string,updateData: UpdateProfileInput, role: "student" | 'admin' | 'organizer'){
         
          if(updateData.password){
             updateData.password = await hashPassword(updateData.password);
          }
          let model;
          switch(role){
             case 'student':
                model = studentModel
                break;
             case 'organizer':
                model = organizerModel
                break;
             case 'admin':
                model= adminModel
                break;
             default:
                model = userModel;
          }
           const { role: _, ...dataToUpdate } = updateData;
          const updatedUser = await model.findByIdAndUpdate(new Types.ObjectId(userId),
          {$set: dataToUpdate}, {returnDocument: "after", runValidators: true}).select("-password")
          if (!updatedUser) {
           throw new AppError("User not found", 404);
          }

          return {
            success: true,
            message: "Profile Updated Successfully!",
            updatedUser
          }
    }
    
   
}  

export default new UserService();