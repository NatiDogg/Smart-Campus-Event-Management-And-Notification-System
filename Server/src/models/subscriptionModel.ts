import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  
       studentId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "student",
          required: true,
          unique: true
       },
       preferredCategories:[
           {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true
           }
       ]
 
     

},{timestamps: true});
subscriptionSchema.index({studentId: 1});



const subscriptionModel = mongoose.models.subscription || mongoose.model("subscription",subscriptionSchema);

export default subscriptionModel;