import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

       userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true
       },
       title:{
         type: String,
         required: true
       },
       message:{
        type: String,
         required: true
       },
       status:{
         type: String,
         enum: ['sent', 'failed'],
         default: 'sent'
       },
       eventId:{
         type: mongoose.Schema.Types.ObjectId,
          ref: "event",
          required: true
       }
 
     

},{timestamps: true});



const notificationModel = mongoose.models.notification || mongoose.model("notification",notificationSchema);

export default notificationModel;