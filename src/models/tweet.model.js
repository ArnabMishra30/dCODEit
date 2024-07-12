import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        // ref: "User",
        required: true,
        refPath: 'ownerModel'
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['User', 'Faculty']
    }
}, { timestamps: true })


export const Tweet = mongoose.model("Tweet", tweetSchema)