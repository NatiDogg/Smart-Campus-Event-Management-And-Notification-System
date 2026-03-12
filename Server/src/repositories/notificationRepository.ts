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