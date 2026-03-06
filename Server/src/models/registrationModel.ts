import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  
        studentId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        eventId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        status:{
            type: String,
            enum: ["registered","cancelled"],
            default: "registered"
        }

 
     

},{timestamps: true});
registrationSchema.index({studentId: 1, eventId: 1},{unique: true})

const registrationModel = mongoose.models.Registration || mongoose.model("Registration",registrationSchema);