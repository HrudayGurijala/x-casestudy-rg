import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js"
import notificationRoutes from "./routes/notification.route.js"
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";

const app = express();
const PORT = ENV.PORT

// Middleware order is important!
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))  // Add this for form data
app.use(clerkMiddleware())

// Routes should come before Arcjet middleware
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/notifications", notificationRoutes)

// Apply Arcjet middleware after routes
app.use(arcjetMiddleware)

app.get("/",(req,res)=> res.send("testing"))

const startServer = async () => {
    try {
        await connectDB()
        if(ENV.NODE_ENV !== "production"){
            app.listen(PORT,()=>console.log(`server at http://localhost:${PORT}`))
        }
    } catch (error) {
        console.error("Failed to connect to the server", error.message)
        process.exit(1)
    }
};

startServer();

export default app;