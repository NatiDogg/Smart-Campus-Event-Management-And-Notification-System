import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
  
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
 
     

},{timestamps: true});
interestSchema.index({studentId: 1, eventId: 1},{unique: true})

const interestModel = mongoose.models.interest || mongoose.model("interest",interestSchema);

export default interestModel;