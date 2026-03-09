import { Types } from "mongoose";
import registrationModel from "../models/registrationModel.js";

export const isStudentRegistered = (studentId: string, eventId: string  )=>{
      return registrationModel.findOne({studentId: new Types.ObjectId(studentId),eventId: new Types.ObjectId(eventId), status: "registered" })
}

export const getStudentsRegistration = ()=>{
    return registrationModel.find({status: "registered"}).populate("StudentId", "fullName profile department")
}








