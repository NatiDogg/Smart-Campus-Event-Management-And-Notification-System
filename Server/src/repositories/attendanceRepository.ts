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

export const findAllAttendendStudentNumber = (organizerId: string)=>{
        return attendanceModel.countDocuments({
           confirmedBy: new Types.ObjectId(organizerId),
           isPresent: true
        })
} 

export const getOrganizerAttendanceTrends = async(organizerId: string)=>{
      return await attendanceModel.aggregate([
            {
               $match:{confirmedBy: new Types.ObjectId(organizerId), isPresent: true}
            },
            {
               $group: {
                    _id: {
                         year: {$year: "$createdAt"},
                         month: { $month: "$createdAt" }
                    },
                    totalAttendance: { $sum: 1 }
               }
            },
            {
               $sort: { "_id.year": 1, "_id.month": 1 }
            }
      ])
}
export const getAllAttendanceTrends = async () => {
  return await attendanceModel.aggregate([
    {
      $match: { isPresent: true }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalAttendance: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);
};

export const getStudentEventAttendanceStatus = (studentId: string, eventId: string)=>{
      return attendanceModel.findOne({studentId: new Types.ObjectId(studentId), eventId: new Types.ObjectId(eventId), isPresent: true})
}