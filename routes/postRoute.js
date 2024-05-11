const express = require('express');
const router = express.Router();
const { createPost, showPost, showSinglePost, deletePost, updatePost, addComment, addLike, removeLike } = require('../controllers/postController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post('/create',
 //isAuthenticated, 
 //isAdmin, 
 createPost
);
router.get('/show', showPost);
router.get('/:id', showSinglePost);
router.delete('/delete/:id', 
//isAuthenticated, isAdmin,
 deletePost);
router.put('/update/:id', //isAuthenticated, isAdmin,
 updatePost);
router.put('/comment/:id', //isAuthenticated,
 addComment);
router.put('/addlike/:id', //isAuthenticated,
 addLike);
router.put('/removelike/:id', //isAuthenticated,
 removeLike);


module.exports = router;