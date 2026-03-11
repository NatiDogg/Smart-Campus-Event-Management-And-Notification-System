import { Types } from "mongoose";
import interestModel from "../models/interestModel.js";



export const createInterestRecord = (studentId: string , eventId: string)=>{
     return interestModel.create({
        studentId: new Types.ObjectId(studentId),
        eventId: new Types.ObjectId(eventId)
     })
}
export const removeInterestRecord = (studentId: string , eventId: string)=>{
      return interestModel.findOneAndDelete({
        studentId: new Types.ObjectId(studentId),
        eventId: new Types.ObjectId(eventId),
        interestType: "interested"
     })
}
export const isStudentInterested = (studentId: string, eventId: string)=>{
    return interestModel.findOne({
          studentId: new Types.ObjectId(studentId),
          eventId: new Types.ObjectId(eventId),
          interestType: "interested"
    })
}




