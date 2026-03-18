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
    }).sort({createdAt: -1}).lean()
}

export const findOrganizerAverageRating = async(organizerId: string)=>{
     const result = await feedbackModel.aggregate([
        {
            $lookup:{
                from: 'event',
                localField: "eventId",
                foreignField: "_id",
                as: "events"
            }

        },
        {
            $unwind:"$events"
        },
        {
            $match:{'events.organizedBy': new Types.ObjectId(organizerId)}

        },
        {
            $group:{
                _id: null,
                averageRating: {$avg: '$rating'}
            }
        }
     ]);  
     return result[0]?.averageRating || 0


}
