import mongoose, { Schema } from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        refPath: 'subscribedByModel'
    },
    subscribedByModel: {
        type: String,
        required: true,
        enum: ['User', 'Faculty']
    },
    channel: {
        type: Schema.Types.ObjectId,
        refPath: 'channelOfModel'
    },
    channelOfModel: {
        type: String,
        required: true,
        enum: ['User', 'Faculty']
    }
}, { timestamps: true })

export const Subscription = mongoose.model("Subscription", subscriptionSchema)