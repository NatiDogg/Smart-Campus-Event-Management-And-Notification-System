import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  
        studentId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
            required: true
        },
        eventId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "event",
            required: true
        },
        status:{
            type: String,
            enum: ["registered","cancelled"],
            default: "registered"
        }

 
     

},{timestamps: true});
registrationSchema.index({studentId: 1, eventId: 1},{unique: true})

const registrationModel = mongoose.models.registration || mongoose.model("registration",registrationSchema);

export default registrationModel;