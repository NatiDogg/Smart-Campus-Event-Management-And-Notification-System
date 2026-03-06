import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  
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
          rating:{
            type:Number,
            required: true
          },
          comment:{
            type:String,
            required: true
          }
 
     

},{timestamps: true});

feedbackSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

const feedbackModel = mongoose.models.feedback || mongoose.model("feedback",feedbackSchema);

export default feedbackModel;