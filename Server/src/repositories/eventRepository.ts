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
export const cancelOrganizerEvent = async (eventId: string, organizerId: string) => {
  return await eventModel.findOneAndUpdate(
    { 
      _id: new Types.ObjectId(eventId), 
      organizedBy: new Types.ObjectId(organizerId) // 🛡️ Security: Must own the event
    },
    { 
      $set: { status: 'cancelled' } 
    },
    { 
      returnDocument: 'after', 
      runValidators: true 
    }
  );
};

export const findAllEvents = ()=>{ //student
     return eventModel.find({status: "approved"}).populate("category", "name").populate("organizedBy", "organizationName").sort({ startDate: 1 })
}
export const findPendingEvents = ()=>{ //admin
      return eventModel.find({status: "pending"}).populate("category", "name").populate("organizedBy", "organizationName")
}
export const approvePendingEvent = (id: string)=>{ // admin
    const eventId = new Types.ObjectId(id); 
    return eventModel.findByIdAndUpdate(eventId,{status: "approved"}, {returnDocument: "after"});
}
export const rejectPendingEvent = (id: string)=>{ // admin
    const eventId = new Types.ObjectId(id); 
    return eventModel.findByIdAndUpdate(eventId,{status: "rejected"},{returnDocument: "after"});
}
export const getAdminEvents = ()=>{
    return eventModel.find({}).populate('organizedBy', 'organizationName').sort({createdAt: -1})
}

export const updateEventRegistrationCount = (eventId: string, amount: number) => {
  return eventModel.findByIdAndUpdate(new Types.ObjectId(eventId), { $inc: { registrationCount: amount } }, {    new: true, runValidators: true } );
}
export const findPopularEvents = (limit: number) => {
  return eventModel.find({ status: "approved" })
    .populate("category", "name")
    .sort({ registrationCount: -1 }) 
    .limit(limit)
    .lean();
}

export const findLiveApprovedEvents = (organizerId: string) => {
    return eventModel.find({
        organizedBy: new Types.ObjectId(organizerId),
        status: "approved",
        endDate: { $gte: new Date() } 
    }).sort({ startDate: 1 });
}

export const countOrganizerPendingEvents = (organizerId: string)=>{
      return eventModel.countDocuments({
          organizedBy: new Types.ObjectId(organizerId),
          status: "pending"
      })
}

export const getOrganizerEventStatusDistribution = async(organizerId: string)=>{
       return await eventModel.aggregate([
           {
            $match: {
                organizedBy: new Types.ObjectId(organizerId)
            }
           },
           {
            $group: {
                _id: "$status",
                count: {$sum: 1}
            }
           }
       ])
} 

export const getAllActiveEvents = ()=>{
   return  eventModel.countDocuments({status: "approved"})
}











