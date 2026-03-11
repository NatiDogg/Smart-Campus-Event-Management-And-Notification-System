import express from 'express'
import type { RequestHandler, Router } from "express";
import { authUser } from '../middlewares/authMiddleware.js';
import { createOrganizerHandler,createNewCategoryHandler,approveEventHandler,rejectEventHandler,deactivateUserHandler,getAllUsersHandler,getAllEventsHandler } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { getPendingEventsHandler } from '../controllers/eventController.js';

const adminRouter:Router = express.Router()
//middlewares
adminRouter.use(authUser as unknown as RequestHandler);
adminRouter.use(isAdmin as unknown as RequestHandler);


adminRouter.get("/pendingEvents", getPendingEventsHandler)
adminRouter.post("/createOrganizer",createOrganizerHandler);
adminRouter.post("/createCategory",createNewCategoryHandler);
adminRouter.patch("/approve/:id",approveEventHandler)
adminRouter.patch("/reject/:id",rejectEventHandler)
adminRouter.get("/users", getAllUsersHandler)
adminRouter.post("/deactivate",deactivateUserHandler);
adminRouter.get("/events", getAllEventsHandler)




export default adminRouter;