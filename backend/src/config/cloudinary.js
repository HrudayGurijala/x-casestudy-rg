import { v2 } from "cloudinary";
import { ENV } from "./env.js";

//if error in file upload check the og source code
// or import as cloudinary directly
const cloudinary = v2.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;