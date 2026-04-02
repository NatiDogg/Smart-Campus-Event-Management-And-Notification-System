import { Types } from "mongoose";
import notificationModel from "../models/notificationModel.js";

export const saveNotification = (userId: string,eventId: string, subject: string)=>{
       
      return notificationModel.create({
            userId: new Types.ObjectId(userId),
            eventId:  new Types.ObjectId(eventId),
            title: subject,
            message: subject
      })
}

export const getAllUserNotifications = (userId: string)=>{
     return notificationModel.find({userId: new Types.ObjectId(userId), status: "sent"}).populate("eventId", "title description").sort({createdAt: -1}).lean()
}

export const deleteNotification = (userId: string,notificationId: string) => {
   return notificationModel.findOneAndDelete({userId: new Types.ObjectId(userId), _id: new Types.ObjectId(notificationId)})
}