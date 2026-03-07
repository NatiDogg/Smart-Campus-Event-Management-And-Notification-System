import { create, findEvent } from "../repositories/eventRepository.js";
import AppError from "../utils/appError.js";
import type { eventCreationType } from "../utils/zodEventValidator.js";
import { uploadToCloudinary,deleteFromCloudinary } from "../helpers/cloudinaryHelper.js";
import CategoryService from "./categoryService.js";
import { Types } from "mongoose";
class EventService{
      async createEvent(eventData: eventCreationType, id:string, fileBuffer: Buffer){
        
        const existingEvent = await findEvent(eventData.title, eventData.startDate);
  
        if(existingEvent){
            throw new AppError("You have already scheduled an event with this title for this date.", 400);
        }
        const category = await CategoryService.findMatchingCategory(eventData.category);
         if(!category){
           throw new AppError("Invalid category name. Please provide a registered category.", 400);
         }
        const result = await uploadToCloudinary(fileBuffer, "events");
        const {secure_url, public_id} = result

        //create event
    

         
         try {
          const newlyCreatedEvent = await create({
            ...eventData,
            imageUrl: secure_url,
            imagePublicId: public_id,
            organizedBy: new Types.ObjectId(id),
            category: category._id


         });
         return {
          success: true,
          message: "Event Created Successfully!",
          event: newlyCreatedEvent
         }

          
         } catch (error) {
          console.error("Cleanup Error:", error);
            await deleteFromCloudinary(public_id);
           throw new AppError("Failed to save event. Please try again.", 500);
         }




        
           
      }
}

export default new EventService();


