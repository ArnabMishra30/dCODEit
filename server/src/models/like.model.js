import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'likedByModel'
        },
        likedByModel: {
            type: String,
            required: true,
            enum: ['User', 'Faculty']
        }
    },
    { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
