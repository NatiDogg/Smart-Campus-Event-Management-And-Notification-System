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
        enum: ["student","organizer","admin"],
        required: true
    }


},{timestamps: true, discriminatorKey: "role"});

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;


