import express from 'express'
import type { RequestHandler, Router } from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { subscribeToCategoryHandler,getAllSubscriptionHandler } from '../controllers/subscriptionController.js'

const subscriptionRouter = express.Router()

subscriptionRouter.use(authUser as unknown as RequestHandler)


subscriptionRouter.put("/category",subscribeToCategoryHandler as unknown as RequestHandler);
subscriptionRouter.get("/all-subscription", getAllSubscriptionHandler as unknown as RequestHandler);


export default subscriptionRouter;