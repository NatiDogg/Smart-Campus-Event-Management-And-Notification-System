import express from 'express'
import type { RequestHandler, Router } from 'express'
import { getNotificationsHandler, removeNotificationHandler } from '../controllers/notificationController.js';
import { authUser } from '../middlewares/authMiddleware.js';


const notificationRouter = express.Router()
notificationRouter.use(authUser as unknown as RequestHandler)
notificationRouter.get("/get",getNotificationsHandler as unknown as RequestHandler);
notificationRouter.delete("/delete/:id",removeNotificationHandler as unknown as RequestHandler);
export default notificationRouter;