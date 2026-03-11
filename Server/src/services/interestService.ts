import { createInterestRecord, isStudentInterested, removeInterestRecord } from "../repositories/interestRepository.js";
import EventService from "./eventService.js";
import AppError from "../utils/appError.js";

class InterestService{
     
     async addInterest(studentId: string, eventId: string){
       const [event,alreadyInterested] = await Promise.all([EventService.getEventById(eventId),isStudentInterested(studentId,eventId)])
       if(!event || event.status !== "approved"){
          throw new AppError("Event not found or is no longer active.",404)
       }
       const currentDate = new Date()
       if(event.startDate && new Date(event.startDate) < currentDate){
          throw new AppError("Cannot mark interest for an event that has already passed.", 400);
       }

       if(alreadyInterested){
          throw new AppError("You've already marked your interest!", 400);
       }
       const newInterest = await createInterestRecord(studentId,eventId)
       if(!newInterest){
         throw new AppError("Failed to mark interest! Please try again",400)
       }
       return {
         success: true,
         message: "Interest marked successfully!",
         newInterest
       }



     }
     async removeInterest(studentId: string, eventId: string){
         const deletedRecord = await removeInterestRecord(studentId, eventId);
         if (!deletedRecord) {
           throw new AppError("No interest record found to remove.", 404);
         }
         return {
           success: true,
           message: " Removed from your interests Successfully!",
         };
     }
     async hasStudentBeenInterested(studentId: string, eventId: string){
        const isInterested = await isStudentInterested(studentId,eventId);
        return isInterested
     }
}

export default new InterestService();