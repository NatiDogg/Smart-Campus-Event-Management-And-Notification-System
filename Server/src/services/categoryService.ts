import { createCategory, findAndDeleteCategoryById, findCategory, getAllCategories } from "../repositories/categoryRepository.js";
import AppError from "../utils/appError.js";
import { categoryCreationType } from "../utils/zodCategoryValidator.js";


class CategoryService{
       async findMatchingCategory(name: string){
          const category = await findCategory(name);
             return category
       }
       async createNewCategory(categoryData: categoryCreationType){
         const newlyCreatedCategory = await createCategory(categoryData);
         return newlyCreatedCategory;
       }
       async registerNewCategory(categoryData: categoryCreationType){
        const existingCategory = await this.findMatchingCategory(categoryData.name);
         if (existingCategory) {
           throw new AppError("Category already Created!", 400);
         }
         const newlyCreatedCategory = await this.createNewCategory(categoryData);
         if (!newlyCreatedCategory) {
            throw new AppError( "Cant create Category right now. Please try again!",500 );
         }
         return newlyCreatedCategory;


       }
       async findAllCategories(){
        const categories = await getAllCategories()
        if(!categories){
          throw new AppError("Failed to Get Categories",500)
        }
        return categories;
       }
       async removeCategory(categoryId: string){
          const deletedCategory = await findAndDeleteCategoryById(categoryId)
          if(!deletedCategory){
            throw new AppError("Failed to delete Category now",500)
          }
          return deletedCategory
       }
       
}

export default new CategoryService();