import express from 'express'
import type { RequestHandler, Router } from 'express'
import { getAllEventsHandler,getPendingEventsHandler,getSingleEventHandler } from '../controllers/eventController.js';
import { authUser } from '../middlewares/authMiddleware.js';

const eventRouter:Router = express.Router();
eventRouter.use(authUser as unknown as RequestHandler)
//events for the student or public routes
eventRouter.get("/events",getAllEventsHandler);
eventRouter.get("/event/:id",getSingleEventHandler as unknown as RequestHandler);





export default eventRouter;