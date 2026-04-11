import { findStudentAttendedEvent,findAttendeesForEvent, takeStudentAttendance, findAllAttendendStudentNumber, getOrganizerAttendanceTrends, getAllAttendanceTrends } from "../repositories/attendanceRepository.js"
import AppError from "../utils/appError.js";

class AttendanceService {
  private readonly monthNames = [
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
  private formatTrendData(rawData: any[]) {
    const formattedData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      // Create a fresh date for each iteration to avoid month-leap bugs
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthNum = d.getMonth() + 1; // MongoDB months are 1-12
      const yearNum = d.getFullYear();
      const label = `${this.monthNames[monthNum - 1]} ${yearNum}`;

      const dbMatch = rawData.find(
        (item) => item._id.month === monthNum && item._id.year === yearNum
      );

      formattedData.push({
        name: label,
        attendance: dbMatch ? dbMatch.totalAttendance : 0,
      });
    }
    return formattedData;
  }
  async getStudentAttendedEvents(studentId: string) {
    const attendanceRecords = await findStudentAttendedEvent(studentId);
    return attendanceRecords
      .map((record) => record.eventId)
      .filter((event) => event !== null);
  }
  async getAttendanceSheetForEvent(eventId: string) {
    const attendees = await findAttendeesForEvent(eventId);
    if (!attendees) {
      throw new AppError("Failed to get Attendees for this Event!", 500);
    }
    return attendees;
  }

  async takeAttendance(
    studentId: string,
    eventId: string,
    organizerId: string,
    isPresent: boolean
  ) {
    const attendance = await takeStudentAttendance(
      studentId,
      eventId,
      organizerId,
      isPresent
    );
    if (!attendance) {
      throw new AppError("Failed to take attendance", 500);
    }
    return attendance;
  }
  async getAllAttendedStudents(organizerId: string) {
    const count = await findAllAttendendStudentNumber(organizerId);
    if (count === undefined || count === null) {
    throw new AppError("Failed to Count Attended Students!", 500);
    }
    return count;
  }
  async getOverallOrganizerAttendanceTrends(organizerId: string) {
      const rawData = await getOrganizerAttendanceTrends(organizerId);
       return this.formatTrendData(rawData);
  }
  async getOverallAttendanceTrends() {
    const rawData = await getAllAttendanceTrends(); 
    return this.formatTrendData(rawData);
  }
}

export default new AttendanceService()










