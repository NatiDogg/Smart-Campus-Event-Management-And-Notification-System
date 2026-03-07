import userModel from "../models/userModel.js";



export const  getAll = ()=>{
     return userModel.find({})
}

export const findById = (id: string)=>{
     return userModel.findById(id);
}
export const findByEmail = (email:string)=>{
    return userModel.findOne({email: email});
}