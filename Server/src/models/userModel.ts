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
    },
    profile:{
        type: String,
        default: function(): string{
             const name = this.fullName ? encodeURIComponent(this.fullName) : "user"
             return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
        }
    },
    fcmTokens:{
          type: [String],
          default: []
    },
    provider:{
        type: String,
        enum: ["local", 'google'],
        default: 'local'
    },
    resetPasswordToken:{
        type: String,
        default: null
    },
    resetPasswordExpire:{
        type: Date,
        default: null
    }


},{timestamps: true, discriminatorKey: "role"});


userSchema.pre('findOneAndDelete', async function () {
 
  const docToUpdate = await this.model.findOne(this.getQuery());
  
  if (docToUpdate) {
    const userId = docToUpdate._id;
    if (docToUpdate.role === 'organizer') {
      // Find all events created by this organizer
      const organizerEvents = await mongoose.model('event').find({ organizedBy: userId }).select('_id');
      
      // Extract just the IDs into an array: [id1, id2, id3...]
      const eventIds = organizerEvents.map(event => event._id);

      if (eventIds.length > 0) {
        // Delete all registrations for all events owned by this organizer
        await mongoose.model('registration').deleteMany({ eventId: { $in: eventIds } });
        
        // Delete all feedback for all events owned by this organizer
        await mongoose.model('feedback').deleteMany({ eventId: { $in: eventIds } });
        
        // Finally, delete the events themselves
        await mongoose.model('event').deleteMany({ organizedBy: userId });
        
        
      }
    }
    // Cleaning up related collections
    await mongoose.model('registration').deleteMany({ studentId: userId });
    await mongoose.model('feedback').deleteMany({ studentId: userId });
    await mongoose.model('subscription').deleteMany({studentId: userId});
    
    
  }
});

const userModel = mongoose.models.user || mongoose.model("user",userSchema);



export default userModel;


