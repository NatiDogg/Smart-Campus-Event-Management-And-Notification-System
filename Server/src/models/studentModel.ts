import mongoose from "mongoose";
import userModel from "./userModel.js";

const studentModel = userModel.discriminators?.student || userModel.discriminator("student", new mongoose.Schema({
       
       department: {
        type: String
       },
       acadamicYear:{
        type: Number
       },
       studentId: {
        type: String,
        unique: true
       },
       interests:[
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            
         }
       ]
       
       
}));

export default studentModel;
