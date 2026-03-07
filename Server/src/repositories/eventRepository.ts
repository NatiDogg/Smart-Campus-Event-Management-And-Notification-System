import mongoose from "mongoose";
import eventModel from "../models/eventModel.js";
import { eventCreationType } from "../utils/zodEventValidator.js";

export type CreateEventDTO =  Omit<eventCreationType, "category"> & {
    category: mongoose.Types.ObjectId;
    imageUrl: string;
    imagePublicId: string;
    organizedBy: mongoose.Types.ObjectId;
  };
 

export const create = (eventData: CreateEventDTO)=>{
    return eventModel.create(eventData);
}

export const findEvent = (title: string, startDate: Date)=>{
    return eventModel.findOne({title,startDate});
}







