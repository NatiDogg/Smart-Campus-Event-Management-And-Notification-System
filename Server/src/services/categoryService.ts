import { findCategory } from "../repositories/categoryRepository.js";


class CategoryService{
       async findMatchingCategory(name: string){
          const category = await findCategory(name);
             return category
       }
}

export default new CategoryService();