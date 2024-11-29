import { Submission } from '../models/submission.model.js'
import { Task } from '../models/task.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'

//new submission by a student
const createSubmission = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { answer } = req.body;

    if (answer === "") {
        throw new ApiError(400, "answer is requred")
    }

    const task = await Task.findById(taskId);

    // Check if the submission deadline has passed
    if (new Date() > new Date(task.submitBy)) {
        throw new ApiError(400, "The deadline for this task has passed");
    }

    let ansImage;
    if (req.file) {
        const ansImageLocalPath = req.file.path;
        ansImage = await uploadOnCloudinary(ansImageLocalPath);

        if (!ansImage) {
            throw new ApiError(400, "Image upload failed");
        }
    }

    const submission = await Submission.create({
        taskId,
        student: req.user._id,
        answer,
        screenshot: ansImage ? ansImage.url : null
    });

    if (!submission) {
        throw new ApiError(400, "Submission failed");
    }

    // Add the submission ID to the task's submissions array
    task.submissions.push(submission._id);
    await task.save();

    return res.status(201).json({
        status: 200,
        data: submission,
        message: "Submission created successfully!"
    });
})

//get all submissions
const getAllSubmissions = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }

    // Fetch all submissions
    // const submissions = await Submission.find();
    const submissions = await Submission.find({taskId}).populate('student', 'name avatar email');

    if (!submissions || submissions.length === 0) {
        throw new ApiError(404, "No submissions found");
    }

    // Return response
    return res.status(200).json(
        new ApiResponse(200, submissions, "All submissions fetched successfully")
    );
})

// const getAllSubmissions = asyncHandler(async (req, res) => {
//     const { taskId } = req.params;

//     // Aggregation pipeline to fetch submissions and populate student details
//     const submissions = await Submission.aggregate([
//         { $match: { taskId: taskId } },
//         {
//             $lookup: {
//                 from: 'users', // Collection name for users
//                 localField: 'student',
//                 foreignField: '_id',
//                 as: 'studentDetails'
//             }
//         },
//         { $unwind: { path: '$studentDetails', preserveNullAndEmptyArrays: true } },
//         {
//             $project: {
//                 _id: 1,
//                 taskId: 1,
//                 answer: 1,
//                 screenshot: 1,
//                 submittedAt: 1,
//                 'studentDetails.name': 1,
//                 'studentDetails.avatar': 1,
//                 'studentDetails.email': 1
//             }
//         }
//     ]);

//     if (!submissions || submissions.length === 0) {
//         throw new ApiError(404, "No submissions found");
//     }

//     // Return response
//     return res.status(200).json(
//         new ApiResponse(200, submissions, "All submissions fetched successfully")
//     );
// })

//delete submission
const deleteSubmission = asyncHandler(async (req, res) => {
    const { taskId, submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    const task = await Task.findById(taskId);

    if (!submission) {
        throw new ApiError(404, "Submission not found");
    }
    if (submission.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this submission");
    }
    // Check if the submission belongs to the task
    if (!submission.taskId.equals(taskId)) {
        throw new ApiError(400, "Submission does not belong to the specified task");
    }
    // Delete the submission
    await Submission.findByIdAndDelete(submissionId);
    // Remove the submission reference from the task's submissions array
    await Task.findByIdAndUpdate(taskId, {
        $pull: { submissions: submissionId }, // Use $pull to remove the submission reference
    });
    await task.save();
    // Optionally delete the tweet image from Cloudinary if it exists
    if (submission.screenshot) {
        await deleteFromCloudinary(submission.screenshot);
    }
    return res.status(200).json({
        status: 200,
        message: "Submission deleted successfully!"
    });
})

export {
    createSubmission,
    deleteSubmission,
    getAllSubmissions
    // getUserSubmissions
}

//get user submissions
// const getUserSubmissions = asyncHandler(async (req, res) => {
//     // TODO: get user tweets
//     const { userId } = req.params;

//     //validate user id
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         throw new ApiError(400, "Invalid user id");
//     }

//     //fetch submissions of the specified user
//     const submissions = await Submission.find({ student: userId }).populate('taskId');
//     if (!submissions || submissions.length === 0) {
//         throw new ApiError(400, "No submissions found")
//     }

//     //return response
//     return res.status(200).json(
//         new ApiResponse(200, submissions, "submissions fetched successfully!!")
//     );

// })