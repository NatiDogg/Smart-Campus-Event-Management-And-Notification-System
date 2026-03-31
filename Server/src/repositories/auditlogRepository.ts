import auditlogModel from "../models/auditlogModel.js";


export const saveAuditLog = ( userId: string, action: string, targetType: "event" | "user" | "category" | "announcement", 
  targetId: string)=>{
  return auditlogModel.create({
      userId,
      action,
      targetType,
      targetId
    });
}

export const getAllAuditLogs = (page: number, limit: number)=>{
    const skipValue = (page - 1) * limit;
    return auditlogModel.find({}).populate('userId', 'fullName role')
    .populate('targetId') 
    .sort({ createdAt: -1 }).skip(skipValue).limit(limit).lean()
}




