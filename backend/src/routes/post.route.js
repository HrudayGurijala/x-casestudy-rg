import express from "express"

const router = express.Router()

//public routes
routes.get("/",getPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);

//protec'd routed
router.post("/:postId/like", protectRoute, likePost);
router.delete("/:postId", protectRoute, deletePost);
router.post("/", protectRoute, upload.single("image"), createPost);

export default router;