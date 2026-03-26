import express from 'express'
 
import type {Router} from 'express'
import { signInHandler,loginHandler,logOutHandler,refreshTokenHandler,googleAuthCallbackHandler,googleAuthHandler,getMeHandler } from '../controllers/authController.js';

const authRouter:Router = express.Router();

authRouter.post("/signin",signInHandler);
authRouter.post("/login",loginHandler);
authRouter.post("/logout",logOutHandler);
authRouter.post("/refresh",refreshTokenHandler);
authRouter.get("/google",googleAuthHandler);
authRouter.get("/signInWithGoogle/callback",googleAuthCallbackHandler)
authRouter.get("/me/:token",getMeHandler);


export default authRouter;