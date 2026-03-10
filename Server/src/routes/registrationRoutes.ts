import express from 'express'
import type { RequestHandler, Router } from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { registerStudentToEventHandler,unRegisterStudentToEventHandler } from '../controllers/registerationController.js'

const registrationRouter = express.Router()
registrationRouter.use(authUser as unknown as RequestHandler)

registrationRouter.post("/register",registerStudentToEventHandler as unknown as RequestHandler)
registrationRouter.delete("/unregister",unRegisterStudentToEventHandler as unknown as RequestHandler)


export default registrationRouter;