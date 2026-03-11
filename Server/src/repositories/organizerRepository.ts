import { Types } from "mongoose";
import organizerModel from "../models/organizerModel.js";
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";


export const createOrganizer = (organizerData: organizerCreationType)=>{
      return  organizerModel.create(organizerData);
}

export const findOrganizerById = (organzierId: string)=>{
    const id = new Types.ObjectId(organzierId)
    return organizerModel.findById(id).select("fullName email");
} 