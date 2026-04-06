import { subscriptionSchemaType } from "../utils/zodSubscriptionValidator.js";
import CategoryService from "./categoryService.js";
import { isValid } from "../utils/validMongodbId.js";
import AppError from "../utils/appError.js";
import categoryModel from "../models/categoryModel.js";
import { createOrUpdateSubscription, findStudentSubscription } from "../repositories/subscriptionRepository.js";

class SubscriptionService{
     async subscribeToCategory(studentId: string,preferredCategories: string[]){
         const allValid = preferredCategories.every(categoryId=> isValid(categoryId));
         if (!allValid) throw new AppError("Invalid Category ID format", 400);
         const existingCount = await categoryModel.countDocuments({
            _id: {$in: preferredCategories}
         })
         if(existingCount !== preferredCategories.length){
            throw new AppError("One or more selected categories do not exist", 404);
         }


         const createdSubscription = await createOrUpdateSubscription(studentId, preferredCategories);
         if(!createdSubscription){
            throw new AppError("Failed to create or update Subscription",400);
         }
         return {
            success: true,
            message: "Subscribed Successfully!",
            createdSubscription
         }

     }
     async getStudentSubscription(studentId: string){
       const subscriptions = await findStudentSubscription(studentId);
       if (!subscriptions) {
        return { success: true,
          message: 'Retrieved All Subscriptions', 
          subscriptions: [] 
         };
       }
       return {
          success: true,
          message: "Retrieved All Subscriptions",
          subscriptions
       }
     }
}

export default new SubscriptionService()