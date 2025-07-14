import express from "express"
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = ENV.PORT


app.get("/",(req,res)=> res.send("testing"))


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