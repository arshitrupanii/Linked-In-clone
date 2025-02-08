import express from "express";
import { signup, login, logout, getCurrentuser } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', protectedRoute, getCurrentuser)

export default router;