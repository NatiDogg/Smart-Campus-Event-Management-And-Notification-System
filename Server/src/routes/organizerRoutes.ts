import express from 'express'
import type {Router, RequestHandler} from 'express'
import { getEventsByOrganizerHandler,createEventHandler,deleteEventHandler,updateEventHandler } from '../controllers/eventController.js';
import { authUser } from '../middlewares/authMiddleware.js';
import { isOrganizer } from '../middlewares/organizerMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const organizerRouter:Router = express.Router()
organizerRouter.use(authUser as unknown as RequestHandler);
organizerRouter.use(isOrganizer as unknown as RequestHandler);

organizerRouter.post("/create", upload.single("image"),createEventHandler as unknown as RequestHandler);
organizerRouter.get("/events",getEventsByOrganizerHandler as unknown as RequestHandler);
organizerRouter.put("/update/:id",updateEventHandler as unknown as RequestHandler)
organizerRouter.delete("/deleteEvent/:id", deleteEventHandler as unknown as RequestHandler);

export default organizerRouter;