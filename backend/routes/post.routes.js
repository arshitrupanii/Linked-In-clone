import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { createComment, createPost, deletePost, getFeedpost, getPost, likepost } from '../controller/post.controller.js';

const router = express.Router();

router.get('/', protectedRoute, getFeedpost)
router.post('/create', protectedRoute, createPost)
router.delete('/delete/:id', protectedRoute, deletePost)
router.get('/:id', protectedRoute, getPost)
router.post('/:id/comment', protectedRoute, createComment)
router.post('/:id/like', protectedRoute, likepost)

export default router