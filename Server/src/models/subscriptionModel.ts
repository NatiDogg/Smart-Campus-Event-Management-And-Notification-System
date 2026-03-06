import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  
       studentId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true
       },
       preferredCategories:[
           {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
           }
       ]
 
     

},{timestamps: true});



const subscriptionModel = mongoose.models.Subscription || mongoose.model("Subscription",subscriptionSchema);