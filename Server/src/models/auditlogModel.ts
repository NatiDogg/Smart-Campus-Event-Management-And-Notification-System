import mongoose from "mongoose";

const auditlogSchema = new mongoose.Schema({
      
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, //who performed an action
    action: {
        type: String,
        required: true
    }, //what they did
     targetType: {
        type: String,
        enum: ["Event", "User", "Category"],
        required: true
    }, // what object they acted on
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, // the object detail
        



},{timestamps: true})


const auditlogModel = mongoose.models.Auditlog || mongoose.model("Auditlog",auditlogSchema);

export default auditlogModel;