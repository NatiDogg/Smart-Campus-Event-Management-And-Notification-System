import { findStudentAttendedEvent,findAttendeesForEvent, takeStudentAttendance } from "../repositories/attendanceRepository.js"
import AppError from "../utils/appError.js";

class AttendanceService{
      async getStudentAttendedEvents(studentId: string){
          const attendanceRecords = await findStudentAttendedEvent(studentId);
          return attendanceRecords.map(record=>record.eventId).filter(event=> event !== null);
      }
      async getAttendanceSheetForEvent(eventId: string){
         const attendees = await findAttendeesForEvent(eventId);
         if(!attendees){
            throw new AppError("Failed to get Attendees for this Event!",500)
         }
         return attendees;
      } 

      async takeAttendance(studentId: string, eventId: string, organizerId: string, isPresent: boolean){
           const attendance = await takeStudentAttendance(studentId, eventId, organizerId,isPresent);
           if(!attendance){
            throw new AppError("Failed to take attendance",500)
           }
           return attendance
      }

}

export default new AttendanceService()










