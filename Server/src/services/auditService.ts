import { getAllAuditLogs, saveAuditLog } from "../repositories/auditlogRepository.js"
import AppError from "../utils/appError.js";


class AuditService{
    async logAction(userId: string, action: string, targetType: "event" | "user" | "category" | "announcement", 
  targetId: string){
        try {
          await saveAuditLog(userId, action, targetType, targetId);
        } catch (err) {
          console.error("AUDIT_LOG_ERROR:", err);
        }
      
    }
    async getAuditLogs(page: number, limit: number){
       const allLogs = await getAllAuditLogs(page, limit)
        if(!allLogs){
          throw new AppError("Failed to fetch AuditLogs!",500)
        }
        return allLogs
    }
}

export default new AuditService()