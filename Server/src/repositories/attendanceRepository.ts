import { Types } from "mongoose";
import attendanceModel from "../models/attendanceModel.js";

export const findStudentAttendedEvent = (studentId: string)=>{
     return attendanceModel.find({studentId: new Types.ObjectId(studentId), isPresent: true }).populate("eventId").sort({createdAt: -1}).lean()
}

export const findAttendeesForEvent = (eventId: string)=>{
     return attendanceModel.find({eventId: new Types.ObjectId(eventId)});
}

export const takeStudentAttendance = (studentId: string, eventId: string, organizerId: string, isPresent: boolean)=>{
     return attendanceModel.findOneAndUpdate({
           studentId: new Types.ObjectId(studentId),
           eventId: new Types.ObjectId(eventId)
     },{
          isPresent,
          confirmedBy: new Types.ObjectId(organizerId)
     },{
          upsert: true,
          returnDocument: "after",
          runValidators: true
     })
}