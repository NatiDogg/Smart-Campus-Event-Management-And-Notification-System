import express from 'express'
import type { RequestHandler, Router } from "express";
import { authUser } from '../middlewares/authMiddleware.js';
import { createOrganizerHandler,createNewCategoryHandler,approveEventHandler,rejectEventHandler,deactivateUserHandler,getAllUserHandler } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const adminRouter:Router = express.Router()

adminRouter.post("/createOrganizer",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,createOrganizerHandler);
adminRouter.post("/createCategory",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,createNewCategoryHandler);
adminRouter.patch("/approveEvent/:id",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,approveEventHandler)
adminRouter.patch("/rejectEvent/:id",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,rejectEventHandler)
adminRouter.get("/users",authUser as unknown as RequestHandler, isAdmin as unknown as RequestHandler, getAllUserHandler)
adminRouter.post("/deactivate",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,deactivateUserHandler);



export default adminRouter;