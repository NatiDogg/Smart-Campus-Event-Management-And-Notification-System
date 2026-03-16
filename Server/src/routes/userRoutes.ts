import express from 'express'
import type { RequestHandler, Router } from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { handleProfileUpdate, handleRegisterToken, handleRemoveToken } from '../controllers/userController.js';

const userRouter:Router = express.Router()
userRouter.use(authUser as unknown as RequestHandler);

userRouter.post("/register-fcm",handleRegisterToken as unknown as RequestHandler);
userRouter.post("/remove-fcm",handleRemoveToken as unknown as RequestHandler);
userRouter.patch("/profile",handleProfileUpdate as unknown as RequestHandler);


export default userRouter;