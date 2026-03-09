import express from 'express'
import type { RequestHandler, Router } from 'express'
import { createEventHandler,getEventsByOrganizerHandler,updateEventHandler,deleteEventHandler,getAllEventsHandler,getPendingEventsHandler,getSingleEventHandler } from '../controllers/eventController.js';
import { authUser } from '../middlewares/authMiddleware.js';
import { isOrganizer } from '../middlewares/organizerMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const eventRouter:Router = express.Router();

eventRouter.post("/createEvent",authUser as unknown as RequestHandler,isOrganizer as unknown as RequestHandler, upload.single("image"),createEventHandler as unknown as RequestHandler);
eventRouter.get("/organizerEvents",authUser as unknown as RequestHandler,isOrganizer as unknown as RequestHandler,getEventsByOrganizerHandler as unknown as RequestHandler);
eventRouter.put("/updateEvent/:id",authUser as unknown as RequestHandler,isOrganizer as unknown as RequestHandler,updateEventHandler as unknown as RequestHandler)
eventRouter.delete("/deleteEvent/:id",authUser as unknown as RequestHandler,isOrganizer as unknown as RequestHandler, deleteEventHandler as unknown as RequestHandler);

eventRouter.get("/allEvents",authUser as unknown as RequestHandler,getAllEventsHandler);
eventRouter.get("/singleEvent/:id",authUser as unknown as RequestHandler,getSingleEventHandler as unknown as RequestHandler);




export default eventRouter;