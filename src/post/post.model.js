import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "El titulo es necesario"],
        },
        content: {
            type: String,
            required: [true, "El contenido es necesario"],
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        comments: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                postedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Post', postSchema);