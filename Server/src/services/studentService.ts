import { createStudent, findStudentById } from "../repositories/studentRepository.js"

import AppError from "../utils/appError.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js"
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