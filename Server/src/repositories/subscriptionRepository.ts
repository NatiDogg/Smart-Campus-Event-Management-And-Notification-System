import { Types } from "mongoose";
import subscriptionModel from "../models/subscriptionModel.js";


export const createOrUpdateSubscription = (studentId: string, preferredCategories: string[])=>{
      return  subscriptionModel.findOneAndUpdate(
          {studentId: new Types.ObjectId(studentId)},
          {$set: {preferredCategories}},
          {upsert: true, returnDocument: "after"}

      )
}

export const findStudentSubscription = (studentId: string)=>{
    return subscriptionModel.findOne({studentId: new Types.ObjectId(studentId)}).populate("preferredCategories", "name")
}