
import { isStudentRegistered,getStudentsRegistration,  createRegistration, getRegistrationCountForEvent, deleteRegistration, getRegistrationForReminders, findAllStudentRegisteredEvents, findStudentEventsByDateRange, findAllEventRegistrationForOrganizer, getRegistrationStatsByCategory,getAllRegistrationStatsByCategory } from "../repositories/registrationRepository.js";
import AppError from "../utils/appError.js";
import EventService from "./eventService.js";
import NotificationService from "./notificationService.js";


class RegistrationService{
    async verifyStudentRegistrationStatus(studentId: string, eventId:string){
         const studentStatus = await isStudentRegistered(studentId, eventId);
         return studentStatus;
    }
    async getStudentsRegistrationStatus(eventId: string){
        const students = await getStudentsRegistration(eventId);
        return students;
    }
    async RegisterStudentToEvent(studentId: string, eventId: string){
          const event = await EventService.getEventById(eventId);
          if(!event || event.status !== "approved"){
            throw new AppError("This event is not available for registration",400)
          }
         const currentRegistrationsCount = await getRegistrationCountForEvent(eventId);
         if (event.capacity && currentRegistrationsCount >= event.capacity) {
            throw new AppError("Sorry, this event is already full!", 400);
        }
        const currentDate = new Date();
        if (event.startDate && new Date(event.startDate) < currentDate) {
          throw new AppError("This event has already started or passed.", 400);
        }
        const isStudentRegistered = await this.verifyStudentRegistrationStatus(studentId,eventId)
        if(isStudentRegistered){
            throw new AppError("You are Already Registered to this Event!",400)
        }
        const registration = await createRegistration(studentId, eventId)
        if(!registration){
            throw new AppError("Registration failed. Please try again!",400)
        }
         void EventService.incrementRegistrationCount(eventId);
         void NotificationService.notifyStudentEventRegistrationStatus(eventId, studentId, "registered")
        return {
            success: true,
            message: 'You are Registered to This Event Successfully!',
            registration
        }
    }

    async unRegisterStudentToEvent(studentId: string, eventId: string){
         const event = await EventService.getEventById(eventId);
          if (!event) {
           throw new AppError("Event not found.", 404);
         }
           const currentDate = new Date();
        if (event.startDate && new Date(event.startDate) < currentDate) {
          throw new AppError("You cannot unregister from an event that has already started or passed.", 400);
        }
        const deletedRegistration = await deleteRegistration(studentId, eventId);
        if (!deletedRegistration) {
          throw new AppError("No registration found for this event.", 404);
        }
         void EventService.decrementRegistrationCount(eventId);
         void NotificationService.notifyStudentEventRegistrationStatus(eventId, studentId, "unregistered")

        return {
          success: true,
          message: "Successfully unregistered from the event.",
        };


    }
    async getRegistrationDetailForReminder(startDate: Date, endDate: Date){
       const regisrationDetails = await getRegistrationForReminders(startDate,endDate);
       return regisrationDetails;
    }
    async getAllStudentRegisteredEvents(studentId: string){
        const registrationRecords = await findAllStudentRegisteredEvents(studentId);
        return registrationRecords.map(record=>record.eventId).filter(event=> event !==null);
    }
    async getStudentEventsInDateRange(studentId: string, startDate: Date, endDate: Date){
       const RegisteredEvents = await findStudentEventsByDateRange(studentId, startDate, endDate)
       return RegisteredEvents.map(registered=> registered.eventId).filter(event=>event !== null);
    }
    async getAllEventRegistrationForOrganizer(organizerId: string){
        const totalRegistration = await findAllEventRegistrationForOrganizer(organizerId);
        if(!totalRegistration){
          return 0
        }
        return totalRegistration
    }
    async getAllCategoryDemographicsForOrganizer(organizerId: string){
      const rawData = await getRegistrationStatsByCategory(organizerId)
      return rawData.map(item => ({
        category: item._id,
        registrations: item.registrationCount
      }));
    }
    async getAllRegistrationStatsByCategoryForAdmin(){
       const rawData = await getAllRegistrationStatsByCategory()
       return rawData.map(data=>(
          {
            category: data._id,
            registrations: data.registrationCount
          }
       ))
    }
    

}

export default new RegistrationService()