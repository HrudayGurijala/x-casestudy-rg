import express from "express"
import { getCurrentUser, getUserProfile, updateProfile, syncUser, followUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router()

//public routes
router.get("/profile/:username",getUserProfile);

//protected routes
router.put("/profile",protectRoute, updateProfile)
router.post("/sync",protectRoute, syncUser)
router.post("/me",protectRoute, getCurrentUser)
router.post("/follow/:targetUserId",protectRoute, followUser)


export default router;