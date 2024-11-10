import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (mediaURL: string) => {
  return await cloudinary.v2.uploader.upload(mediaURL, {
    folder: "social_media_app",
    resource_type: "auto", // Automatically detect media type (image or video)
  });
};
