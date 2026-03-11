import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

       studentId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "student",
          required: function(){
              return this.type === 'targeted'
          }
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
       },
       type:{
         type:String,
         enum:["targeted","boardcasted"],
         default:"targeted"
       }
 
     

},{timestamps: true});



const notificationModel = mongoose.models.notification || mongoose.model("notification",notificationSchema);

export default notificationModel;