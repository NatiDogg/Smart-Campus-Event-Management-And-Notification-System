import express from 'express'
import type { RequestHandler, Router } from "express";
import { authUser } from '../middlewares/authMiddleware.js';
import { createOrganizerHandler,createNewCategoryHandler } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const adminRouter:Router = express.Router()

adminRouter.post("/createOrganizer",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,createOrganizerHandler);
adminRouter.post("/createCategory",authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler,createNewCategoryHandler);



export default adminRouter;