import express from "express";
import { signup, login, logout, getCurrentuser } from "../controller/auth.controller.js";

const router = express.Router();

// all tested
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', getCurrentuser)

export default router;