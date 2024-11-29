import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
    {
        taskId: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        screenshot: {
            type: String, // Cloudinary URL for the screenshot
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export const Submission = mongoose.model("Submission", submissionSchema);
