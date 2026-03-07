import { v2 as cloudinary } from "cloudinary";
import { env } from "../utils/zodEnvFilesValidator.js";
 
cloudinary.config({
    cloud_name: env.CLOUD_NAME,
     api_key: env.CLOUD_API_KEY,
    api_secret: env.CLOUD_SECRET_KEY
   
})

export default cloudinary;