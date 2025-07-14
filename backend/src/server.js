import express from "express"
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
connectDB()
const PORT = ENV.PORT


app.get("/",(req,res)=> res.send("testing"))

app.listen(PORT,()=>console.log(`server at http://localhost:${PORT}`))