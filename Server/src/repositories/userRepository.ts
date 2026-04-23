import userModel from "../models/userModel.js";
import { Types } from "mongoose";


export const  getAll = ()=>{
     return userModel.find({}).sort({createdAt: -1})
}

export const findById = (userId: string)=>{
     const id = new Types.ObjectId(userId);
     return userModel.findById(id);
}
export const findByEmail = (email:string)=>{
    return userModel.findOne({email: email});
}
export const deleteUser = (userId:string)=>{
     const id = new Types.ObjectId(userId)
     return userModel.findByIdAndDelete(id)
}
export const updateFcmToken = (userId: string, newToken: string)=>{
      const id = new Types.ObjectId(userId)
     return  userModel.findByIdAndUpdate(id, {$addToSet: {fcmTokens: newToken}}, {returnDocument: "after"})
}

export const removeToken = (userId: string, staleToken: string[])=>{
     const id = new Types.ObjectId(userId)
     return  userModel.findByIdAndUpdate(
        id,
        { 
            $pullAll: { fcmTokens: staleToken } 
        },
        {
          returnDocument: "after"
        }
    );
}
export const findAllStudents = ()=>{
     return userModel.find({role: "student"});
}

export const findAllOrganizers = ()=>{
     return userModel.find({role: 'organizer'}).select('organizationName').sort({createdAt: -1}).lean()
}



export const findUserByResetToken = (token: string)=>{
     return userModel.findOne({
           resetPasswordToken: token,
           resetPasswordExpire: {$gte: new Date()}
     })
}


