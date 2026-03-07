import categoryModel from "../models/categoryModel.js";


export const findCategory = (name: string)=>{
     return categoryModel.findOne({name});
}