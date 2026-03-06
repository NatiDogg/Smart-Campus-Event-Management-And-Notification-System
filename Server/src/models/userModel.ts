import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        trim:true,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["Student","Organizer","Admin"]
    }


},{timestamps: true, discriminatorKey: "role"});

const userModel = mongoose.models.User || mongoose.model("User",userSchema);

export default userModel;


