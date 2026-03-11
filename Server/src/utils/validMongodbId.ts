import mongoose from "mongoose";

export const isValid = (id:string)=>{
     return mongoose.Types.ObjectId.isValid(id);
}