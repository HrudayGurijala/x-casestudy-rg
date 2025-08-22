import { v2 } from "cloudinary";
import { ENV } from "./env.js";

// Configure Cloudinary
v2.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

// Export the configured v2 instance
export default v2;