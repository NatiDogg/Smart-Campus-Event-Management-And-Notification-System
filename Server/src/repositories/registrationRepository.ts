import { Types } from "mongoose";
import registrationModel from "../models/registrationModel.js";

export const isStudentRegistered = (studentId: string, eventId: string  )=>{
      return registrationModel.findOne({studentId: new Types.ObjectId(studentId),eventId: new Types.ObjectId(eventId), status: "registered" })
}

export const getStudentsRegistration = (eventId: string)=>{
    return registrationModel.find({eventId: new Types.ObjectId(eventId)
        ,status: "registered"}).populate("studentId", "fullName email profile department fcmTokens").populate("eventId", "title")
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

export const getRegistrationForReminders = async (tomorrowStart: Date, tomorrowEnd: Date)=>{
    const registrations = await registrationModel.find({ status: "registered" })
        .populate({
            path: 'eventId',
            match: { startDate: { $gte: tomorrowStart, $lt: tomorrowEnd } },
            select: 'title location startDate'
        })
        .populate('studentId', "fcmTokens");
        
    return registrations.filter(reg => reg.eventId !== null);

}









