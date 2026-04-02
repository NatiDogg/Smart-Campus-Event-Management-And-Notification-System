import { Types } from "mongoose";
import categoryModel from "../models/categoryModel.js";
import { categoryCreationType } from "../utils/zodCategoryValidator.js";


export const findCategory = (name: string)=>{
     return categoryModel.findOne({name});
}

export const createCategory = (categoryData: categoryCreationType)=>{
     return categoryModel.create(categoryData);
}
export const getAllCategories = ()=>{
     return categoryModel.find({}).select("name").sort({createdAt: -1});
}
export const findAndDeleteCategoryById = (categoryId: string)=>{
      const id = new Types.ObjectId(categoryId)
    return categoryModel.findByIdAndDelete(id)
}