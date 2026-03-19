import { findStudentAttendedEvent,findAttendeesForEvent, takeStudentAttendance, findAllAttendendStudentNumber, getOrganizerAttendanceTrends } from "../repositories/attendanceRepository.js"
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
      async getAllAttendedStudents(organizerId: string){
         const count = await findAllAttendendStudentNumber(organizerId)
         if(!count){
            throw new AppError("Failed to Count Attended Students!",500)
         }
         return count;
      } 
      async getOverallOrganizerAttendanceTrends(organizerId: string){
          const rawData = await getOrganizerAttendanceTrends(organizerId);

          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const formattedData = [];
          for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);

            const monthNum = d.getMonth() + 1; 
            const yearNum = d.getFullYear();
            const label = `${monthNames[monthNum - 1]} ${yearNum}`;

            // 3. Find if the database has a value for this specific month/year
            const dbMatch = rawData.find(
              (item) => item._id.month === monthNum && item._id.year === yearNum
            );

            // 4. If match exists, use its count; otherwise, use 0
            formattedData.push({
              name: label,
              attendance: dbMatch ? dbMatch.totalAttendance : 0,
            });
          }

          return formattedData;

      }
      

}

export default new AttendanceService()










