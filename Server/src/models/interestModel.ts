import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
  
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
 
     

},{timestamps: true});
interestSchema.index({studentId: 1, eventId: 1},{unique: true})

const interestModel = mongoose.models.interest || mongoose.model("interest",interestSchema);

export default interestModel;