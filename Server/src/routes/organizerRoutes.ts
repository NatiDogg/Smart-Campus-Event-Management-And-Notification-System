import express from 'express'
import type {Router, RequestHandler} from 'express'
import { createEventHandler,updateEventHandler,deleteEventHandler,getEventsByOrganizerHandler,getOrganizerFeedbacksHandler, getRegisteredStudentsForEventHandler, getOrganizerDashboardHandler, markStudentAttendanceHandler, getOrganizerAnalytics } from '../controllers/organizerController.js';
import { authUser } from '../middlewares/authMiddleware.js';
import { isOrganizer } from '../middlewares/organizerMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const organizerRouter:Router = express.Router()
organizerRouter.use(authUser as unknown as RequestHandler);
organizerRouter.use(isOrganizer as unknown as RequestHandler);

organizerRouter.post("/create", upload.single("image"),createEventHandler as unknown as RequestHandler);
organizerRouter.get("/events",getEventsByOrganizerHandler as unknown as RequestHandler);
organizerRouter.put("/update/:id",updateEventHandler as unknown as RequestHandler)
organizerRouter.put("/cancelEvent/:id", deleteEventHandler as unknown as RequestHandler);
organizerRouter.get("/feedbacks",getOrganizerFeedbacksHandler as unknown as RequestHandler);
organizerRouter.get("/dashboard",getOrganizerDashboardHandler as unknown as RequestHandler);
organizerRouter.get("/registeredStudents/:id",getRegisteredStudentsForEventHandler as unknown as RequestHandler);
organizerRouter.patch("/attendance/mark/:id",markStudentAttendanceHandler as unknown as RequestHandler);
organizerRouter.get("/analytics",getOrganizerAnalytics as unknown as RequestHandler);


export default organizerRouter;