import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()) //
app.use(cookieParser());

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/user" , userRoutes)

app.listen(PORT, () => {
    console.log("server listening on port " + PORT);
    connectDB();    
});