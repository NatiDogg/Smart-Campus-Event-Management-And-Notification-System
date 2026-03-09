import mongoose from "mongoose";
import userModel from "./userModel.js";

const organizerModel = userModel.discriminators?.organizer || userModel.discriminator("organizer", new mongoose.Schema({
         
        organizationName:{
            type:String,
            required: true
        },
        phoneNumber:{
            type:String,
            required: true
        }
        


}))

export default organizerModel;