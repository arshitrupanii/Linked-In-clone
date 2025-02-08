import express from "express";
import { getSuggestedConnections } from "../controller/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/suggestions', protectedRoute, getSuggestedConnections)




export default router