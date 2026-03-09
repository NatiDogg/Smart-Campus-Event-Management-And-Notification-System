import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
      
      title: {
        type: String,
        required: true
      },
      description:{
        type: String,
        required: true
      },
      imageUrl:{
        type: String,
        required: true
      },
      imagePublicId:{
         type: String,
         required: true
      },
      location:{
         type:String,
         required: true
      },
      category:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "category",
         required: true,
         index: true
      },
      status:{
         type: String,
         enum: ['pending', 'approved', 'cancelled'],
         default: 'pending',
         index:true
      },
      organizedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "organizer",
        required: true,
        index: true
      },
      capacity:{
        type: Number,
        required: true
      },
      time:{
        type:String,
        required: true
      },
      startDate:{
        type: Date,
        required: true,
        index: true
      },
      endDate:{
        type: Date,
        required: true
      }






},{timestamps: true});
eventSchema.index({ category: 1, startDate: 1 });
eventSchema.index({title: 1, startDate:1}, {unique: true});
const eventModel = mongoose.models.event || mongoose.model("event",eventSchema);

export default eventModel;