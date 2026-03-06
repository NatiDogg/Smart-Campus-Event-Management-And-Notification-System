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
      image:{
        type: String,
        required: true
      },
      location:{
         type:String,
         required: true
      },
      category:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
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
        ref: "Organizer",
        required: true,
        index: true
      },
      capacity:{
        type: Number,
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

const eventModel = mongoose.models.event || mongoose.model("event",eventSchema);

export default eventModel;