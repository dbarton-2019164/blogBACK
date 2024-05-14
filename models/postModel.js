const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "El titulo es obligatorio"],
        },
        content: {
            type: String,
            required: [true, "El contenido es obligatorio"],
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: ObjectId, ref: "User" }],
        comments: [
            {
                name: String, 
                text: String, 
                created: { type: Date, default: Date.now }
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);