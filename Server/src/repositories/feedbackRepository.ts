import { Types } from "mongoose";
import feedbackModel from "../models/feedbackModel.js";
import { feedbackType } from "../utils/zodFeedbackValidator.js";


export const createNewFeedback = (feedbackData: feedbackType, studentId: string, eventId: string)=>{
    return feedbackModel.create({
        ...feedbackData,
        studentId: new Types.ObjectId(studentId),
        eventId: new Types.ObjectId(eventId)
    })
}

export const checkAlreadySubmittedFeedback = (studentId: string, eventId: string)=>{
      return feedbackModel.exists({
        studentId: new Types.ObjectId(studentId), 
        eventId: new Types.ObjectId(eventId) 
    });
}

export const findOrganizerFeedbacks = (organizerId: string)=>{
    return feedbackModel.find({}).populate("studentId", "fullName profile").populate({
         path: "eventId",
         match: {
            organizedBy: new Types.ObjectId(organizerId)
         },
         select: "title"
    }).lean()
}
