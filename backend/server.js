import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js"
import connectionsRoutes from "./routes/connections.routes.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());


// all api is tested 
// notifications and connections last 2 api
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/connections", connectionsRoutes)

app.listen(PORT, () => {
    console.log("server listening on port " + PORT);
    connectDB();
});