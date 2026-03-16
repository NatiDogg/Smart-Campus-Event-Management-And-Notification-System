import { findStudentAttendedEvent } from "../repositories/attendanceRepository.js"

class AttendanceService{
      async getStudentAttendedEvents(studentId: string){
          const attendanceRecords = await findStudentAttendedEvent(studentId);
          return attendanceRecords.map(record=>record.eventId).filter(event=> event !== null);
      }
}

export default new AttendanceService()










