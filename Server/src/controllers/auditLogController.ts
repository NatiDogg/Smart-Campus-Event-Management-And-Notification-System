import { handleError } from "../helpers/handleError.js"
import type { Response,Request } from "express"
import AuditService from "../services/auditService.js"

interface AuditQuery{
   _page?: string,
   _limit?: string
}
export const getAllAuditLogsHandler = async(req: Request<{},{},{},AuditQuery>, res:Response)=>{
         const page = parseInt(req.query._page || '1', 10)
         const limit = parseInt(req.query._limit || '5',10)
     try {
        const result = await AuditService.getAuditLogs(page, limit)
        return res.status(200).json({
          success: true,
          message: "Audit Logs Retrieved Successfully!",
          logs: result
        })
     } catch (error) {
      return handleError(res,error)
     }
}