import { Types } from "mongoose";
import registrationModel from "../models/registrationModel.js";

export const isStudentRegistered = (studentId: string, eventId: string  )=>{
      return registrationModel.findOne({studentId: new Types.ObjectId(studentId),eventId: new Types.ObjectId(eventId), status: "registered" })
}

export const getStudentsRegistration = ()=>{
    return registrationModel.find({status: "registered"}).populate("studentId", "fullName profile department")
}

export const getRegistrationCountForEvent = (eventId: string)=>{
    return registrationModel.countDocuments({
        eventId: new Types.ObjectId(eventId), 
        status: "registered"
    })
}
export const createRegistration = (studentId: string, eventId: string)=>{
    return registrationModel.create({
         studentId: new Types.ObjectId(studentId),
         eventId: new Types.ObjectId(eventId)
    })

}
export const deleteRegistration  =(studentId: string, eventId: string)=>{
    return registrationModel.findOneAndDelete({
         studentId: new Types.ObjectId(studentId),
         eventId:new Types.ObjectId(eventId),
         status: "registered"
    })
}









