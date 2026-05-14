import eventModel from '../models/eventModel.js'
import interestModel from '../models/interestModel.js'
import registrationModel from '../models/registrationModel.js'
import attendanceModel from '../models/attendanceModel.js'
import { callGeminiEngine } from '../utils/geminiEngine.js'

class AnalyticsService {
  
  async getMonthlyDashboardAnalytics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const futureWindow = new Date();
    futureWindow.setDate(now.getDate() + 30);

    // 1. Parallel Database Queries (Optimized)
    const [currentEvents, upcomingPipeline, allRegistrations, allInterests, allAttendance] = await Promise.all([
      eventModel.find({
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
        status: "approved"
      }).populate("category", "name"),

      eventModel.find({
        startDate: { $gt: now, $lte: futureWindow },
        status: { $in: ["approved", "pending"] }
      }).populate("category", "name"),

      registrationModel.find({ status: "registered" }),
      interestModel.find({ interestType: "interested" }),
      attendanceModel.find({ isPresent: true })
    ]);

    // 2. Preparing the Briefing Document
    const briefingData = {
      metadata: {
        month: now.toLocaleString('default', { month: 'long' }),
        date: now.toISOString().split('T')[0]
      },
      performance: currentEvents.map(event => {
        const id = event._id.toString();
        const regs = allRegistrations.filter(r => r.eventId.toString() === id).length;
        const attended = allAttendance.filter(a => a.eventId.toString() === id).length;
        
        return {
          title: event.title,
          category: (event.category as any)?.name || "General",
          capacity: event.capacity,
          registrations: regs,
          attendanceRate: regs > 0 ? Math.min(Math.round((attended / regs) * 100), 100) : 0,
          interest: allInterests.filter(i => i.eventId.toString() === id).length
        };
      }),
      futurePipeline: upcomingPipeline.map(event => ({
        title: event.title,
        status: event.status,
        category: (event.category as any)?.name || "General",
        currentRegs: allRegistrations.filter(r => r.eventId.toString() === event._id.toString()).length
      }))
    };

    
    return await callGeminiEngine(briefingData);
  }
}

export default new AnalyticsService();