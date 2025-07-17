import express from "express"

import upload from "../middlewares/upload.middleware.js"
import {protectRoute} from "../middlewares/auth.middleware.js"
import { getPosts, getPost, getUserPosts, likePost, deletePost, createPost } from "../controllers/post.controller.js"

const router = express.Router()

//public routes
router.get("/", getPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);

//protec'd routed
router.post("/:postId/like", protectRoute, likePost);
router.delete("/:postId", protectRoute, deletePost);
router.post("/", protectRoute, upload.single("image"), createPost);

export default router;