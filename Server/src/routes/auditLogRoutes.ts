import express from 'express'
import type { Router,RequestHandler } from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/adminMiddleware.js'
import { getAllAuditLogsHandler } from '../controllers/auditLogController.js'


const auditLogRouter:Router = express.Router()

auditLogRouter.use(authUser as unknown as RequestHandler)
auditLogRouter.use(isAdmin as unknown as RequestHandler)

auditLogRouter.get("/get",getAllAuditLogsHandler);

export default auditLogRouter;










