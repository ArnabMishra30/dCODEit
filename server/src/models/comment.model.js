import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        //this parentcomment is added for give reply of a comment
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        owner: {
            type: Schema.Types.ObjectId,
            refPath: 'ownerModel'
        },
        ownerModel: {
            type: String,
            required: true,
            enum: ['User', 'Faculty']
        }
    },
    { timestamps: true }
)

commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model("Comment", commentSchema)