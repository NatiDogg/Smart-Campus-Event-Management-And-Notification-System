import express from 'express'
import type { RequestHandler, Router } from 'express'
import { createEventHandler } from '../controllers/eventController.js';
import { authUser } from '../middlewares/authMiddleware.js';
import { isOrganizer } from '../middlewares/organizerMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const eventRouter:Router = express.Router();

eventRouter.post("/createEvent",authUser as unknown as RequestHandler,isOrganizer as unknown as RequestHandler, upload.single("image"),createEventHandler as unknown as RequestHandler)




export default eventRouter;