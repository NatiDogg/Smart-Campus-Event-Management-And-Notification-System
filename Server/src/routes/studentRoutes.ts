import express from 'express'
import type {RequestHandler, Router} from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { getAllStudentEventsHandler, getAnnouncementsHandler, getStudentCalendarHandler } from '../controllers/studentController.js'

const studentRouter:Router = express.Router()

studentRouter.use(authUser as unknown as RequestHandler)

studentRouter.get("/my-events",getAllStudentEventsHandler as unknown as RequestHandler);
studentRouter.get("/announcement",getAnnouncementsHandler as unknown as RequestHandler);
studentRouter.get("/calendar",getStudentCalendarHandler as unknown as RequestHandler);

export default studentRouter;


 
