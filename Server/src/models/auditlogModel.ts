import mongoose from "mongoose";

const auditlogSchema = new mongoose.Schema({
      
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }, //who performed an action
    action: {
        type: String,
        required: true
    }, //what they did
     targetType: {
        type: String,
        enum: ["event", "user", "category",'announcement'],
        required: true
    }, // what object they acted on
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    }, // the object detail
        



},{timestamps: true})


const auditlogModel = mongoose.models.auditlog || mongoose.model("auditlog",auditlogSchema);

export default auditlogModel;