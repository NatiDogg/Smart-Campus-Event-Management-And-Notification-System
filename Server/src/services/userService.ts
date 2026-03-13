import { getAll,findById,findByEmail, deleteUser, updateFcmToken, removeToken, findAllStudents } from "../repositories/userRepository.js";
import AppError from "../utils/appError.js";



class UserService{

    async getUsers(){
      const users = await getAll();
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
          message: "Push notification token updated successfully"
        }
    }
   
}  

export default new UserService();