import express from 'express'
import type {RequestHandler, Router} from 'express'
import { authUser } from '../middlewares/authMiddleware.js'
import { getAllCategoriesHandler,createNewCategoryHandler, deleteCategoryHandler } from '../controllers/categoryController.js'
import { isAdmin } from '../middlewares/adminMiddleware.js'


const categoryRouter:Router = express.Router()
categoryRouter.use(authUser as unknown as RequestHandler)
categoryRouter.post('/create',isAdmin as unknown as RequestHandler, createNewCategoryHandler as unknown as RequestHandler)
categoryRouter.get("/get",authUser as unknown as RequestHandler,getAllCategoriesHandler)
categoryRouter.delete("/delete/:id",isAdmin as unknown as RequestHandler,deleteCategoryHandler);

export default categoryRouter;