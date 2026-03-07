import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (
  fileBuffer: Buffer, 
  folder: string = "uploads"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed: No result returned"));
        resolve(result);
      }
    );
    
    uploadStream.end(fileBuffer);
     
  });
};


export const deleteFromCloudinary = async(publicId: string)=>{
        return await cloudinary.uploader.destroy(publicId);
} 