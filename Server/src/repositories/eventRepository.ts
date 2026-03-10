import mongoose from "mongoose";
import eventModel from "../models/eventModel.js";
import { eventCreationType,eventupdateType } from "../utils/zodEventValidator.js";
import { Types } from "mongoose";



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
export const getOrganizerEvents = (id:string)=>{ //organizer
    return  eventModel.find({organizedBy: new Types.ObjectId(id)}).sort({createdAt: -1});
}

export const findEventById = (eventId:string)=>{ 
     const id = new Types.ObjectId(eventId);
     return eventModel.findById(id).populate("organizedBy", "organizationName");
}

export const updateOrganizerEvent = (eventData: eventupdateType, eventId: string)=>{ //organizer
    const id = new Types.ObjectId(eventId);
    
    return eventModel.findByIdAndUpdate(id, eventData,{returnDocument: "after"}).populate({path: "organizedBy", select: "fullName email organizationName"})
}
export const deleteOrganizerEvent = (eventId: string, organizerId: string)=>{ //organizer
     return eventModel.findOneAndDelete({
           _id: new Types.ObjectId(eventId),
           organizedBy: new Types.ObjectId(organizerId)
     })

}

export const findAllEvents = ()=>{ //student
     return eventModel.find({status: "approved"}).populate("category", "name").populate("organizedBy", "organizationName")
}
export const findPendingEvents = ()=>{ //admin
      return eventModel.find({status: "pending"}).populate("category", "name").populate("organizedBy", "organizationName")
}
export const approveEvent = (id: string)=>{ // admin
    const eventId = new Types.ObjectId(id); 
    return eventModel.findByIdAndUpdate(eventId,{status: "approved"}, {returnDocument: "after"});
}
export const rejectEvent = (id: string)=>{ // admin
    const eventId = new Types.ObjectId(id); 
    return eventModel.findByIdAndUpdate(eventId,{status: "rejected"},{returnDocument: "after"});
}

export const getAdminEvents = ()=>{
    return eventModel.find({$or: [{status: "pending"}, {status: "approved"}]})
}












