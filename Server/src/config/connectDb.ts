import mongoose from "mongoose";
import { env } from "../utils/zodEnvFilesValidator.js";

const connectToDb= async()=>{
      try {
          await mongoose.connect(env.MONGODB_URI);
          console.log("Database Connected Successfully!")
      } catch (error) {
          console.log("Database Connection Failed: "+error);
      }
}


export default connectToDb;










