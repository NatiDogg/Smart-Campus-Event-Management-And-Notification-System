import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

       studentId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
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
          ref: "Event",
          required: true
       },
       type:{
         type:String,
         enum:["targeted","boardcasted"],
         default:"targeted"
       }
 
     

},{timestamps: true});



const notificationModel = mongoose.models.Notification || mongoose.model("Notification",notificationSchema);