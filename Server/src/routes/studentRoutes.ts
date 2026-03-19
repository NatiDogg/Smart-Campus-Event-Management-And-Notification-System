import express from 'express'
import type {RequestHandler, Router} from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { getAllStudentEventsHandler, getStudentCalendarHandler } from '../controllers/studentController.js'
import { getStudentAnnouncementHandler } from '../controllers/announcementController.js'

const studentRouter:Router = express.Router()

studentRouter.use(authUser as unknown as RequestHandler)

studentRouter.get("/my-events",getAllStudentEventsHandler as unknown as RequestHandler);
studentRouter.get("/announcement",getStudentAnnouncementHandler as unknown as RequestHandler);
studentRouter.get("/calendar",getStudentCalendarHandler as unknown as RequestHandler);

export default studentRouter;


 
