import { createStudent, findStudentById } from "../repositories/studentRepository.js"

import AppError from "../utils/appError.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js"
import AnnouncementService from "./announcementService.js";
import AttendanceService from "./attendanceService.js";
import EventService from "./eventService.js";
import InterestService from "./interestService.js";
import RegistrationService from "./registrationService.js";
class StudentService{
     async createNewStudent(studentData: authUserRegisterType){
          const newlyCreatedStudent = await createStudent(studentData);
          return newlyCreatedStudent;
     }
     async getStudentById(studentId: string){
         const student = await findStudentById(studentId);
         return student;
     }
     async getStudentEvents(studentId: string){
          const [registeredEvents,interestedEvents,attendedEvents,popularEvents] = await Promise.all([
               RegistrationService.getAllStudentRegisteredEvents(studentId),
               InterestService.getAllStudentInterestedEvents(studentId),
               AttendanceService.getStudentAttendedEvents(studentId),
               EventService.getPopularEvents()

          ])
          if ( registeredEvents === undefined ||  interestedEvents === undefined ||attendedEvents === undefined || popularEvents === undefined ) {
            throw new AppError("Failed to retrieve your event data", 500);
          }
          return {
               success: true,
               message: "Your Events Retrieved Successfully!",
               popularEvents: popularEvents,
               registeredEvents: registeredEvents,
               interestedEvents: interestedEvents,
               previouslyAttendedEvents: attendedEvents
          }
     }
     async getStudentAnnouncement(){
         const announcements  = AnnouncementService.getAnnouncements()
         if(!announcements){
            throw new AppError("Failed to get school announcements!",500);
         }
         return {
          success: true,
          message: "Announcements retrieved Successfully!",
          announcements
         }
     }
     async getStudentCalendarData(studentId: string, month: number, year: number){
        const startDate = new Date(year, month - 1, 1); 
        const endDate = new Date(year, month, 0, 23, 59, 59);
       const events = await RegistrationService.getStudentEventsInDateRange(studentId,startDate, endDate)
       if(!events){
          throw new AppError("Failed to get user calandar data",500)
       }
       return {
          success: true,
          message: "Calendar events retrieved successfully ",
          calandarEvents: events
       }


     }
     
}

export default new StudentService()