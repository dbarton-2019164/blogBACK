import { Router } from "express";
import { createPost, showPost, showSinglePost, deletePost, updatePost, addComment, addLike, removeLike } from './post.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';



const router = Router();

router.post(
    '/create',
    isAuthenticated,
    isAdmin,
    createPost
);
router.get(
    '/show',
    showPost
);
router.get(
    '/:id',
    showSinglePost
);
router.delete(
    '/delete/:id',
    isAuthenticated,
    isAdmin,
    deletePost
);
router.put(
    '/update/:id',
    isAuthenticated,
    isAdmin,
    updatePost
);
router.put(
    '/comment/:id',
    isAuthenticated,
    addComment
);
router.put(
    '/addlike/:id',
    isAuthenticated,
    addLike
);
router.put(
    '/removelike/:id',
    isAuthenticated,
    removeLike
);


export default router;