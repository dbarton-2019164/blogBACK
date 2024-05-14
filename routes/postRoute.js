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
 deletePost);
router.put('/update/:id',
 updatePost);
router.put('/comment/:id',
 addComment);
/*router.put('/addlike/:id',
 addLike);
router.put('/removelike/:id',
 removeLike);
*/

module.exports = router;