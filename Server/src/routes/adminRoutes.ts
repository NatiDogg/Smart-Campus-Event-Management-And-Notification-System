import express from 'express'
import type { RequestHandler, Router } from "express";
import { authUser } from '../middlewares/authMiddleware.js';
import { createOrganizerHandler,createNewCategoryHandler,approveEventHandler,rejectEventHandler,deactivateUserHandler,getAllUsersHandler,getAllEventsHandler, createAnnouncementHandler,getPendingEventsHandler } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const adminRouter:Router = express.Router()
//middlewares
adminRouter.use(authUser as unknown as RequestHandler);
adminRouter.use(isAdmin as unknown as RequestHandler);


adminRouter.get("/pendingEvents", getPendingEventsHandler)
adminRouter.post("/createOrganizer",createOrganizerHandler as unknown as RequestHandler);
adminRouter.post("/createCategory",createNewCategoryHandler as unknown as RequestHandler);
adminRouter.patch("/approve/:id",approveEventHandler as unknown as RequestHandler)
adminRouter.patch("/reject/:id",rejectEventHandler as unknown as RequestHandler)
adminRouter.get("/users", getAllUsersHandler)
adminRouter.delete("/deactivate",deactivateUserHandler as unknown as RequestHandler);
adminRouter.get("/events", getAllEventsHandler);
adminRouter.post("/createAnnouncement",createAnnouncementHandler as unknown as RequestHandler);




export default adminRouter;