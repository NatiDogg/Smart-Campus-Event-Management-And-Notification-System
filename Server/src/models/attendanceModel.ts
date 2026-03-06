import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  
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
        isPresent:{
            type: Boolean,
            default: false
        },
        confirmedBy:{
            type: mongoose.Schema.Types.ObjectId,
          ref: "Organizer",
          required: true
        }
 
     

},{timestamps: true});

attendanceSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

const attendanceModel = mongoose.models.Attendance || mongoose.model("Attendance",attendanceSchema);