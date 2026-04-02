import type { Request, Response } from "express"
import { handleError } from "../helpers/handleError.js"
import CategoryService from "../services/categoryService.js"
import { AuthRequest } from "../middlewares/authMiddleware.js"
import { categoryCreationSchema } from "../utils/zodCategoryValidator.js"
import AuditService from "../services/auditService.js"
import { isValid } from "../utils/validMongodbId.js"


export const createNewCategoryHandler = async(req:AuthRequest, res:Response)=>{
       const parsed = categoryCreationSchema.safeParse(req.body)
       const {id: adminId} = req.userAccessInfo
       if(!parsed.success){
        const fieldErrors = parsed.error.flatten().fieldErrors;
           const firstErrorKey = Object.keys(fieldErrors)[0] as keyof typeof fieldErrors;
           const errorMessage = fieldErrors[firstErrorKey]?.[0] || "Invalid input data";
         return res.status(400).json({
          success:false,
          message: errorMessage
         })
       }
     try {
      const newCategory = await CategoryService.registerNewCategory(parsed.data);
      void AuditService.logAction(adminId, "CREATED_CATEGORY", "category", newCategory._id.toString());
      return res.status(201).json({
        success: true,
        message: "New Category Created Successfully",
        newCategory
      })
       
     } catch (error) {
         return handleError(res,error);
     }
}

export const getAllCategoriesHandler = async(req:Request, res:Response)=>{
     try {
       const categories = await CategoryService.findAllCategories()
       return res.status(200).json({
        success: true,
        message: "Categories Fetched Successfully!",
        categories
       })
     } catch (error) {
      handleError(res,error)
     }
}

export const deleteCategoryHandler = async(req:Request<{id: string}>, res:Response)=>{
         const {id: categoryId} = req.params
         if(!isValid(categoryId)){
          return res.status(400).json({
            success: false,
            message: 'Invalid Id Format!'
          })
         }
    try {
        const result = await CategoryService.removeCategory(categoryId)
        return res.status(200).json({
          success: true,
          message: "Category Deleted Successfully",
          deletedCategory: result
        })
    } catch (error) {
      return handleError(res,error)
    }
}