import { Types } from "mongoose";
import organizerModel from "../models/organizerModel.js";
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";


export type organizerDTO = organizerCreationType & {
    password: string
}



export const createOrganizer = (organizerData: organizerDTO)=>{
      return  organizerModel.create(organizerData);
}

export const findOrganizerById = (organzierId: string)=>{
    const id = new Types.ObjectId(organzierId)
    return organizerModel.findById(id).select("fullName email");
} 