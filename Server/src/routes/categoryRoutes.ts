import express from 'express'
import type {RequestHandler, Router} from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { getAllCategoriesHandler,createNewCategoryHandler } from '../controllers/categoryController.js'
import { isAdmin } from '../middlewares/adminMiddleware.js'


const categoryRouter:Router = express.Router()
categoryRouter.post('/create', authUser as unknown as RequestHandler,isAdmin as unknown as RequestHandler, createNewCategoryHandler as unknown as RequestHandler)
categoryRouter.get("/get",authUser as unknown as RequestHandler,getAllCategoriesHandler)

export default categoryRouter;