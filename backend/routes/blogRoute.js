import express from 'express';
import { getAllBlogs, createBlog, addComment, getComments } from '../controllers/blogController.js';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.post('/', upload.array('images', 10), createBlog);

// Comments endpoints
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

export default router;
