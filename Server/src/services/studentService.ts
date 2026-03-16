import { createStudent, findStudentById } from "../repositories/studentRepository.js"

import AppError from "../utils/appError.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js"
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
     
}

export default new StudentService()