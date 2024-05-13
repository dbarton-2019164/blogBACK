import cloudinary from '../utils/cloudinary.js';
import Post from './post.model.js';
import ErrorResponse from '../utils/errorResponse.js';
import {main} from '../../configs/server.js';

export const createPost = async (req, res, next) => {
    const { title, content, postedBy, image, likes, comments } = req.body;

    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts",
            width: 1200,
            crop: "scale"
        })
        const post = await Post.create({
            title,
            content,
            postedBy: req.user._id,
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

export const showPost = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(201).json({
            success: true,
            posts
        })
    } catch (error) {
        next(error);
    }
}

export const showSinglePost = async (req, res, next) => {
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

export const deletePost = async (req, res, next) => {
    const currentPost = await Post.findById(req.params.id);

    const ImgId = currentPost.image.public_id;
    if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
    }

    try {
        const post = await Post.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "post deleted"
        })
    } catch (error) {
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        const currentPost = await Post.findById(req.params.id);

        // Construir los datos del objeto
        const data = {
            title: title || currentPost.title,
            content: content || currentPost.content,
            image: image || currentPost.image,
        }

        // Modificar la imagen de la publicación condicionalmente
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

// Agregar comentario
export const addComment = async (req, res, next) => {
    const { comment } = req.body;
    try {
        const postComment = await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: { text: comment, postedBy: req.user._id } }
        }, { new: true });
        
        const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        next(error);
    }
}

// Agregar like
export const addLike = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id }
        }, { new: true });
        
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

// Eliminar like
export const removeLike = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id }
        }, { new: true });

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
