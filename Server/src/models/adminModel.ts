import mongoose from "mongoose";
import userModel from "./userModel.js";

const adminModel = userModel.discriminators?.Admin || userModel.discriminator("Admin", new mongoose.Schema({
         
        phoneNumber:{
            type:String,
            required: true
        },
        adminLevel:{
            type: String,
            enum: ["super", "moderator", "basic"],
            default: 'basic'
        }


}))

export default adminModel;