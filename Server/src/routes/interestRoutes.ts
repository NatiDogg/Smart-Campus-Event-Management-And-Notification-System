import express from 'express'
import type { RequestHandler, Router } from 'express'
import { authUser } from '../middlewares/authMiddleware.js';
import { markInterestHandler,unMarkInterestHandler } from '../controllers/interestController.js';


const interestRouter = express.Router();

interestRouter.use(authUser as unknown as RequestHandler)

interestRouter.post("/mark",markInterestHandler as unknown as RequestHandler);
interestRouter.delete("/unmark",unMarkInterestHandler as unknown as RequestHandler);

export default interestRouter;
