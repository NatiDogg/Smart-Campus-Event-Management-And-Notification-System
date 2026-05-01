import { createStudent, findStudentById } from "../repositories/studentRepository.js"

import AppError from "../utils/appError.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js"
import eventModel from "../models/eventModel.js";
import registrationModel from "../models/registrationModel.js";
import { Types } from "mongoose";
import recommendationModel from "../models/recommendationModel.js";
class StudentService {
  async createNewStudent(studentData: authUserRegisterType) {
    const newlyCreatedStudent = await createStudent(studentData);
    return newlyCreatedStudent;
  }
  async getStudentById(studentId: string) {
    const student = await findStudentById(studentId);
    return student;
  }
  async getStudentCalendarData(studentId: string, month: number, year: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  // 1. Fetch Campus Events
  const campusEvents = await eventModel.find({
    startDate: { $gte: start, $lte: end },
    status: "approved",
  }).populate("category", "name").lean();

  // 2. Fetch Student Registrations (to mark as 'registered')
  const userRegistrations = await registrationModel.find({
    studentId: new Types.ObjectId(studentId),
    status: "registered",
  }).select("eventId").lean();
  const registeredIds = new Set(userRegistrations.filter(r => r.eventId).map(r => r.eventId.toString()));

  // 3. Fetch AI Recommendations (to mark as 'recommended')
  const aiRecDoc = await recommendationModel.findOne({ studentId: new Types.ObjectId(studentId) }).select("eventId").lean();
  const recommendedIds = new Set(aiRecDoc?.eventId?.map((id: any) => id.toString()) || []);

  // 4. Map with Triple-Status Logic
  const formattedEvents = campusEvents.map((event) => {
    const eventIdStr = event._id.toString();
    
    // Priority: Registered > Recommended > Suggested
    let status = "suggested";
    if (registeredIds.has(eventIdStr)) {
      status = "registered";
    } else if (recommendedIds.has(eventIdStr)) {
      status = "recommended";
    }

    return {
      id: event._id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      extendedProps: {
        category: (event.category as any)?.name || "General",
        status: status, 
      },
    };
  });

  return formattedEvents;
}
}

export default new StudentService()