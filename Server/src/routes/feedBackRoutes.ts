import express from 'express'
import type { RequestHandler, Router } from 'express'
import { authUser } from '../middlewares/authMiddleware.js';
import { submitFeedbackHandler } from '../controllers/feedbackController.js';

const feedBackRouter = express.Router()

feedBackRouter.use(authUser as unknown as RequestHandler);


feedBackRouter.post("/submit/:id",submitFeedbackHandler as unknown as RequestHandler);

export default feedBackRouter;



