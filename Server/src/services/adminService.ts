
import AppError from "../utils/appError.js";

import { createAdmin, findAllAdmins } from "../repositories/adminRepository.js";
import { adminTypeDto } from "../repositories/adminRepository.js";

class AdminService{
       async createNewAdmin(adminData: adminTypeDto){
         const newlyCreatedAdmin = await createAdmin(adminData)
         return newlyCreatedAdmin;
       }
       async getAllAdmins(){
         const admins = await findAllAdmins()
         return admins;
       }
       
}

export default new AdminService();
