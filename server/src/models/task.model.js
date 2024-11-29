import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        // title: {
        //     type: String,
        //     required: true,
        //     trim: true
        // },
        description: {
            type: String,
            required: true
        },
        submitBy: {
            type: Date,  // Submission deadline
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Faculty",
            required: true
        },
        submissions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Submission"
            }
        ],
        grading: {
            type: Map,
            of: String, // Map of student IDs to grades
            default: {}
        },
        //from here it is for to assign task to speific users also
        assignedTo: [
            {
                type: Schema.Types.ObjectId,
                refPath: 'onModel' // Dynamically references User or Faculty
            }
        ],
        onModel: {
            type: String,
            enum: ['User', 'Faculty'], // Specifies whether it's a User or Faculty
        },
        isForAll: {
            type: Boolean,
            default: false // Whether the task is for all users and faculty
        }
    },
    {
        timestamps: true
    }
);

export const Task = mongoose.model("Task", taskSchema);
