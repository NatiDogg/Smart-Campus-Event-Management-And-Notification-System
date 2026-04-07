import mongoose from "mongoose";
import userModel from "./userModel.js";

const studentModel = userModel.discriminators?.student || userModel.discriminator("student", new mongoose.Schema({
       
       department: {
        type: String
       },
       studentId: {
        type: String,
        unique: true
       }
       
       
}));

export default studentModel;
