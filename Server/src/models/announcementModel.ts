import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({

        title:{
            type: String,
            required: true,
            trim: true
        },
        content: {
        type: String,
        required: true
        },


},{timestamps: true});

const announcementModel = mongoose.models.announcement || mongoose.model("announcement",announcementSchema);

export default announcementModel;




