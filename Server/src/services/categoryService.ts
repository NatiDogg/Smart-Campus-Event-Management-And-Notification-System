import { createCategory, findCategory } from "../repositories/categoryRepository.js";
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
}

export default new CategoryService();