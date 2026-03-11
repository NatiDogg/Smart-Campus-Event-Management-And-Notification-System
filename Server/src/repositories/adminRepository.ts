import adminModel from "../models/adminModel.js";
import { authAdminLoginType } from "../utils/zodAuthValidator.js";

export type adminTypeDto = authAdminLoginType & {
    fullName: string
}
export const createAdmin = (adminData: adminTypeDto)=>{
      return adminModel.create(adminData);
}