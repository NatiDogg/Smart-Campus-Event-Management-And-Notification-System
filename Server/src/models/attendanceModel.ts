import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  
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
        isPresent:{
            type: Boolean,
            default: false
        },
        confirmedBy:{
            type: mongoose.Schema.Types.ObjectId,
          ref: "organizer",
          required: true
        }
 
     

},{timestamps: true});

attendanceSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

const attendanceModel = mongoose.models.attendance || mongoose.model("attendance",attendanceSchema);

export default attendanceModel;