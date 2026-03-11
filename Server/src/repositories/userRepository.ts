import userModel from "../models/userModel.js";
import { Types } from "mongoose";


export const  getAll = ()=>{
     return userModel.find({})
}

export const findById = (id: string)=>{
     return userModel.findById(id);
}
export const findByEmail = (email:string)=>{
    return userModel.findOne({email: email});
}
export const deleteUser = (userId:string)=>{
     const id = new Types.ObjectId(userId)
     return userModel.findByIdAndDelete(id)
}