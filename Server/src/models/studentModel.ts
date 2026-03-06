import mongoose from "mongoose";
import userModel from "./userModel.js";

const studentModel = userModel.discriminators?.Student || userModel.discriminator("Student", new mongoose.Schema({
       
       department: {
        type: String
       },
       acadamicYear:{
        type: Number
       },
       studentId: {
        type: String
       },
       interests:[
         {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            default:[]
         }
       ],
       fcmTokens:[
          {
            type: String
          }
       ]
}));

export default studentModel;
