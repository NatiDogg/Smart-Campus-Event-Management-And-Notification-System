import organizerModel from "../models/organizerModel.js";
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";


export const createNewOrganizer = (organizerData: organizerCreationType)=>{
      return  organizerModel.create(organizerData);
}