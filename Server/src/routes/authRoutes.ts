import express from 'express'
 
import type {Router} from 'express'
import { signInHandler,loginHandler,logOutHandler,refreshTokenHandler } from '../controllers/authController.js';

const authRouter:Router = express.Router();

authRouter.post("/signin",signInHandler);
authRouter.post("/login",loginHandler);
authRouter.post("/logout",logOutHandler);
authRouter.post("/refresh",refreshTokenHandler);

export default authRouter;