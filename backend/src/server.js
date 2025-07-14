import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"

import userRoutes from "./routes/user.route.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = ENV.PORT

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/",(req,res)=> res.send("testing"))

app.use("api/users",userRoutes)

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT,()=>console.log(`server at http://localhost:${PORT}`))
    } catch (error) {
        console.error("Failed to connect to the server", error.message)
        process.exit(1)
    }
};

startServer();