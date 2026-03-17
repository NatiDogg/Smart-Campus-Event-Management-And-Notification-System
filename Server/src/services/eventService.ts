import {create,findEvent, getOrganizerEvents,updateOrganizerEvent,findEventById, deleteOrganizerEvent, findAllEvents, findPendingEvents, approvePendingEvent, getAdminEvents, updateEventRegistrationCount, findPopularEvents, rejectPendingEvent, findLiveApprovedEvents} from "../repositories/eventRepository.js";
import AppError from "../utils/appError.js";
import type { eventCreationType, eventupdateType } from "../utils/zodEventValidator.js";
import {uploadToCloudinary,deleteFromCloudinary,} from "../helpers/cloudinaryHelper.js";
import { Types } from "mongoose";
import CategoryService from "./categoryService.js";
import RegistrationService from "./registrationService.js";
import InterestService from "./interestService.js";
import NotificationService from "./notificationService.js";
import FeedbackService from "./feedbackService.js";
class EventService {
  async createEvent(eventData: eventCreationType,id: string,fileBuffer: Buffer) {
    const existingEvent = await findEvent(eventData.title, eventData.startDate);

    if (existingEvent) {
      throw new AppError(
        "You have already scheduled an event with this title for this date.",
        400
      );
    }
    const category = await CategoryService.findMatchingCategory(
      eventData.category.trim()
    );
    if (!category) {
      throw new AppError(
        "Invalid category name. Please provide a registered category.",
        400
      );
    }

    let public_id: string | undefined

    try {
       
      const result = await uploadToCloudinary(fileBuffer, "events");
     
      const { secure_url } = result;
      public_id = result.public_id
      const newlyCreatedEvent = await create({
        ...eventData,
        imageUrl: secure_url,
        imagePublicId: result.public_id,
        organizedBy: new Types.ObjectId(id),
        category: category._id,
      });
        void NotificationService.notifyAdminNewEvent({
          id: newlyCreatedEvent._id.toString(),
          title:newlyCreatedEvent.title,
          location:newlyCreatedEvent.location,
          imageUrl:newlyCreatedEvent.imageUrl})// to notify the admin

          
      return {
        success: true,
        message: "Event Created Successfully!",
         newlyCreatedEvent
      };
    } catch (error) {
      console.error("Cleanup Error:", error);
       if(public_id){
         await deleteFromCloudinary(public_id);
       }
     
      throw new AppError("Failed to save event. Please try again.", 500);
    }
  }

  async getEventsByOrganizer(id: string) {
    const events = await getOrganizerEvents(id);

    return {
      success: true,
      message: events.length > 0 ? "Events Retrieved Successfully!" : "No events have been created yet!",
      events
    };
  }
  async getEventById(id:string){
    const event = await findEventById(id)
    return event
  }
  async updateEventByOrganizer(eventData: eventupdateType, organizerId: string, eventId: string){

       const event = await findEventById(eventId);
       if(!event){
         throw new AppError("Event Not Found!",404)
       }
       
       const isTheSameOrganizer = event.organizedBy._id.toString() === organizerId
       
        if (!isTheSameOrganizer) {
          throw new AppError("You do not have permission to update this event", 403);
       }
       if(eventData.category){
         const category = await CategoryService.findMatchingCategory(eventData.category)
         if (!category) {
           throw new AppError(
             "Invalid category name. Please provide a registered category.",
             400
           );
         }
          eventData.category = new Types.ObjectId(category._id) as any;
       }
       const updatedEvent = await updateOrganizerEvent(eventData, eventId)

        if(!updatedEvent){
          throw new AppError("Can't Update Event right now. Please try again",400)
        }
        void NotificationService.notifyStudentEventStatus(updatedEvent._id.toString(), 'updated');
        return {
          success: true,
          message: "Event updated Successfully!",
          updatedEvent
        }


        
  }
  async deleteEvent(organizerId: string, eventId: string){
      const deletedEvent  = await deleteOrganizerEvent(eventId, organizerId)
      if (!deletedEvent) {
        throw new AppError("Event not found or unauthorized", 404);
      }
      if(deletedEvent.imagePublicId){
          await deleteFromCloudinary(deletedEvent.imagePublicId)
      }
      void NotificationService.notifyStudentEventStatus(deletedEvent._id.toString(), 'canceled');

       return {
        success: true,
        message: "Event Deleted Successfully!"
       }

  }
  async getAllEvents(){
      const events = await findAllEvents();
      return {
        success: true,
        message: events.length > 0 ? "Events Retrieved Successfully!" : "No events have been created yet!",
        events
      }
  }
  async getSingleEvent(eventId: string,studentId: string){

     const [event, registration,registeredStudents,interested,isfeedBackSubmitted] = await Promise.all([findEventById(eventId), RegistrationService.verifyStudentRegistrationStatus(studentId, eventId),RegistrationService.getStudentsRegistrationStatus(eventId),InterestService.hasStudentBeenInterested(studentId, eventId),FeedbackService.checkStudentFeedback(studentId, eventId)])
     if(!event || event.status !== "approved"){
       throw new AppError("Event not found", 404);
     }

      return {    
        success: true,
        message: "Event Retrieved Successfully!",
        event,
        isRegistered: !!registration,
        isInterested: !!interested,
        isfeedBackSubmitted: !!isfeedBackSubmitted,
        registeredStudents: registeredStudents
      }

      
      
  }
  async getPendingEvents(){
        const events = await findPendingEvents()
         if(!events){
          throw new AppError("Failed to get Pending Events!",500);
         }
         return events;
  }
   
  async getAllAdminEvents(){
    const events = await getAdminEvents()
    if(!events){
      throw new AppError("Failed to get Events!",500)
    }
    return events;
  }
  async incrementRegistrationCount(eventId: string){
     return await updateEventRegistrationCount(eventId, 1);
  }
  async decrementRegistrationCount(eventId: string) {
    return await updateEventRegistrationCount(eventId, -1);
  }
  async getPopularEvents(limit: number= 5){
    return await findPopularEvents(limit);
  }
  async approveEvent(eventId: string){
    const updatedEvent = await approvePendingEvent(eventId);
    if (!updatedEvent) {
      throw new AppError("Event Not Found!!", 404);
    }
    void NotificationService.notifyOrganizerEventStatus({
       id: updatedEvent.organizedBy,
        title: updatedEvent.title,
        imageUrl: updatedEvent.imageUrl,
      }, "approved");
      return updatedEvent;
  }
  async rejectEvent(eventId: string){
     const rejectedEvent = await rejectPendingEvent(eventId);
      if (!rejectedEvent) {
        throw new AppError("Event Not Found!!", 404);
      }
       void NotificationService.notifyOrganizerEventStatus({
             id: rejectedEvent.organizedBy,
             title: rejectedEvent.title,
            imageUrl: rejectedEvent.imageUrl
          }, "rejected");
       return rejectedEvent;

  }
  async getActiveOrganizerEvents(organizerId: string){
    const activeEvents = await findLiveApprovedEvents(organizerId);
    if(!activeEvents){
      throw new AppError("Failed to fetch Active Events!",500)
    }
    return activeEvents;
  }
}


export default new EventService();















