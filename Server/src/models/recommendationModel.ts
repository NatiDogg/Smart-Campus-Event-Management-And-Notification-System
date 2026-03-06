import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
     
         studentId:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
              required: true
         },
         eventId: [
             {
                type: mongoose.Schema.Types.ObjectId,
              ref: "Event",
              required: true
             }
         ]



},{timestamps: true})
recommendationSchema.index({ studentId: 1 }, { unique: true });

const recommendationModel = mongoose.models.recommendation || mongoose.model("recommendation",recommendationSchema);

export default recommendationModel;