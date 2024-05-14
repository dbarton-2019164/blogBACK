const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');
const User = require('../models/userModel');
//create post
exports.createPost = async (req, res, next) => {
    const { title, content, image, likes, comments } = req.body;

    try {
        //const name = 'usuario'
        //const user = await User.findOne({ name });
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts",
            width: 1200,
            crop: "scale"
        })
        const post = await Post.create({
            title,
            content,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },

        });
        res.status(201).json({
            success: true,
            post
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}


exports.showPost = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('name');
        res.status(201).json({
            success: true,
            posts
        })
    } catch (error) {
        next(error);
    }

}


exports.showSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments.postedBy', 'name');
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        next(error);
    }

}


//delete post
exports.deletePost = async (req, res, next) => {
    const currentPost = await Post.findById(req.params.id);

    const ImgId = currentPost.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const post = await Post.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Publicacion borrada"
        })

    } catch (error) {
        next(error);
    }

}


//update post
exports.updatePost = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        const currentPost = await Post.findById(req.params.id);

        const data = {
            title: title || currentPost.title,
            content: content || currentPost.content,
            image: image || currentPost.image,
        }

        if (req.body.image !== '') {

            const ImgId = currentPost.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'posts',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }

        }

        const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            postUpdate
        })

    } catch (error) {
        next(error);
    }

}

exports.addComment = async (req, res, next) => {
    const { name, comment } = req.body;
    try {
        const postComment = await Post.findByIdAndUpdate(req.params.id, {
            $push: { 
                comments: { 
                    name, 
                    text: comment 
                } 
            }
        }, { new: true });

        const post = await Post.findById(postComment._id);
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};

/*
exports.addLike = async (req, res, next) => {

    try {

     //   const user = await User.findOne({ email: 'admin@gmail.com' });
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id }
        },
            { new: true }
        );
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        main.io.emit('add-like', posts);

        res.status(200).json({
            success: true,
            post,
            posts
        })

    } catch (error) {
        next(error);
    }

}


//remove like
exports.removeLike = async (req, res, next) => {

    try {
      
       // const user = await User.findOne({ email: 'admin@gmail.com' });
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id }
        },
            { new: true }
        );

        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        main.io.emit('remove-like', posts);

        res.status(200).json({
            success: true,
            post
        })

    } catch (error) {
        next(error);
    }

}
*/