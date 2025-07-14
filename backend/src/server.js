import express from "express"

const app = express();


const PORT = 42069;

app.listen(PORT,()=>console.log(`server at http://localhost:${PORT}`))