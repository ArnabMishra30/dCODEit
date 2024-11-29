// import mongoose from 'mongoose';
// import { Task } from '../models/task.model.js'
// import { Faculty } from '../models/faculty.model.js'
// import {User} from '../models/user.model.js'
// import { ApiError } from "../utils/ApiError.js"
// import { asyncHandler } from "../utils/asyncHandler.js"
// import { ApiResponse } from '../utils/ApiResponse.js';

// //create a task
// const createTask = asyncHandler(async (req, res) => {
//     const {/* title,*/ description, submitBy } = req.body;

//     if (/*!title || */ !description || !submitBy) {
//         throw new ApiError(400, "All fields are required");
//     }

//     if (req.user.role !== 'teacher') {
//         throw new ApiError(403, "Only teachers can create tasks");
//     }

//     const task = await Task.create({
//         // title,
//         description,
//         submitBy,
//         createdBy: req.user._id
//     });

//     if (!task) {
//         throw new ApiError(400, "Task not created");
//     }

//     return res.status(201).json({
//         status: 200,
//         data: task,
//         message: "Task created successfully!"
//     });
// });

// //update a task
// const updateTask = asyncHandler(async (req, res) => {

//     const { taskId } = req.params;
//     const { /* title, */ description, submitBy } = req.body;

//     const task = await Task.findById(taskId);

//     if (!task) {
//         throw new ApiError(404, "Task not found");
//     }
//     if (task.createdBy.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, "You do not have permission to update this task");
//     }

//     // if (title) task.title = title;
//     if (description) task.description = description;
//     if (submitBy) task.submitBy = submitBy;

//     await task.save();

//     return res.status(200).json({
//         status: 200,
//         data: task,
//         message: "Task updated successfully!"
//     });

// })

// const getAllTasks = asyncHandler(async (req, res) => {
//     try {
//         const tasks = await Task.aggregate([
//             {
//                 $lookup: {
//                     from: 'faculties', // The collection name for faculty
//                     localField: 'createdBy', // Field in the Task collection
//                     foreignField: '_id', // Field in the Faculty collection
//                     as: 'facultyDetails' // Output array field name
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$facultyDetails',
//                     preserveNullAndEmptyArrays: true // Keep tasks without a corresponding faculty
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     description: 1,
//                     submitBy: 1,
//                     createdBy: 1,
//                     'facultyDetails.fullName': 1,
//                     createdAt: 1, // Include creation date of the task
//                     updatedAt: 1 // Include update date of the task
//                 }
//             }
//         ]);

//         if (!tasks || tasks.length === 0) {
//             throw new ApiError(404, "No tasks found");
//         }

//         return res.status(200).json(
//             new ApiResponse(200, tasks, "All tasks fetched successfully")
//         );
//     } catch (error) {
//         throw new ApiError(500, "Error fetching tasks");
//     }
// });

// //get user tasks
// const getUserTasks = asyncHandler(async (req, res) => {
//     // TODO: get user tweets
//     const { userId } = req.params;

//     //validate user id
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         throw new ApiError(400, "Invalid user id");
//     }

//     //fetch tasks of the specified user
//     const tasks = await Task.find({ createdBy: userId }).populate('submissions');;
//     if (!tasks || tasks.length === 0) {
//         throw new ApiError(400, "No tasks found")
//     }

//     //return response
//     return res.status(200).json(
//         new ApiResponse(200, tasks, "tasks fetched successfully!!")
//     );

// })

// //delete a task
// const deleteTask = asyncHandler(async (req, res) => {
//     const { taskId } = req.params;
//     const task = await Task.findById(taskId);
//     if (!task) {
//         throw new ApiError(404, "Task not found");
//     }
//     if (task.createdBy.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, "You do not have permission to delete this task");
//     }
//     // Delete the tweet from database
//     await Task.findByIdAndDelete(taskId);
//     return res.status(200).json({
//         status: 200,
//         message: "Task deleted successfully!"
//     });
// });

// export {
//     createTask,
//     updateTask,
//     deleteTask,
//     getAllTasks,
//     getUserTasks
// };


////task to specific user
import mongoose from 'mongoose';
import { Task } from '../models/task.model.js';
import { Faculty } from '../models/faculty.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a task
const createTask = asyncHandler(async (req, res) => {
    const { description, submitBy, assignedToEmails, onModel, isForAll } = req.body;

    if (!description || !submitBy /* || !onModel */) {
        throw new ApiError(400, "Description and submission deadline are required");
    }

    if (req.user.role !== 'teacher') {
        throw new ApiError(403, "Only teachers can create tasks");
    }

    //// If isForAll is true, ensure assignedTo and onModel are not provided
    // if (isForAll && (assignedTo.length > 0 || onModel)) {
    //     throw new ApiError(400, "If 'isForAll' is true, 'assignedTo' and 'onModel' should be empty");
    // }

    // Convert emails to user IDs
    // If `isForAll` is true, ignore `assignedToEmails` and `onModel`
    let assignedTo = [];
    let model = null;

    // if (assignedToEmails) {
    //     if (onModel === 'User') {
    //         const users = await User.find({ email: { $in: assignedToEmails } });
    //         if (users.length === 0) {
    //             throw new ApiError(400, "No users found with the provided emails");
    //         }
    //         assignedTo = users.map(user => user._id);
    //     } else if (onModel === 'Faculty') {
    //         const faculties = await Faculty.find({ email: { $in: assignedToEmails } });
    //         if (faculties.length === 0) {
    //             throw new ApiError(400, "No faculties found with the provided emails");
    //         }
    //         assignedTo = faculties.map(faculty => faculty._id);
    //     } else {
    //         throw new ApiError(400, "Invalid model specified");
    //     }
    // }

    if (!isForAll) {
        if (!onModel) {
            throw new ApiError(400, "Model must be specified if 'isForAll' is not true");
        }

        if (assignedToEmails && assignedToEmails.length > 0) {
            if (onModel === 'User') {
                const users = await User.find({ email: { $in: assignedToEmails } });
                if (users.length === 0) {
                    throw new ApiError(400, "No users found with the provided emails");
                }
                assignedTo = users.map(user => user._id);
            } else if (onModel === 'Faculty') {
                const faculties = await Faculty.find({ email: { $in: assignedToEmails } });
                if (faculties.length === 0) {
                    throw new ApiError(400, "No faculties found with the provided emails");
                }
                assignedTo = faculties.map(faculty => faculty._id);
            } else {
                throw new ApiError(400, "Invalid model specified");
            }
        }

        model = onModel; // Set model only if not `isForAll`
    }

    const task = await Task.create({
        description,
        submitBy,
        createdBy: req.user._id,
        // assignedTo: isForAll ? [] : assignedTo,
        // onModel: isForAll ? undefined : onModel,
        assignedTo,  // This will be an empty array if `isForAll` is true
        onModel: model, // This will be null if `isForAll` is true
        isForAll
    });

    if (!task) {
        throw new ApiError(400, "Task not created");
    }

    return res.status(201).json({
        status: 200,
        data: task,
        message: "Task created successfully!"
    });
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { description, submitBy, assignedToEmails, onModel, isForAll } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this task");
    }
    // if (isForAll && (assignedTo.length > 0 || onModel)) {
    //     throw new ApiError(400, "If 'isForAll' is true, 'assignedTo' and 'onModel' should be empty");
    // }

    // Update fields if they are provided
    if (description !== undefined) task.description = description;
    if (submitBy !== undefined) task.submitBy = submitBy;
    if (isForAll !== undefined) task.isForAll = isForAll;
    if (onModel !== undefined) task.onModel = onModel;

    // if (description!== undefined) task.description = description;
    // if (submitBy!== undefined) task.submitBy = submitBy;
    // // if (assignedTo) task.assignedTo = isForAll ? [] : assignedTo;
    // if (onModel!== undefined) task.onModel = isForAll ? undefined : onModel;
    // if (typeof isForAll === 'boolean') task.isForAll = isForAll;

    // Update assignedTo based on provided emails
    if (assignedToEmails !== undefined) {
        let assignedTo = [];
        if (onModel === 'User') {
            const users = await User.find({ email: { $in: assignedToEmails } });
            if (users.length === 0) {
                throw new ApiError(400, "No users found with the provided emails");
            }
            assignedTo = users.map(user => user._id);
        } else if (onModel === 'Faculty') {
            const faculties = await Faculty.find({ email: { $in: assignedToEmails } });
            if (faculties.length === 0) {
                throw new ApiError(400, "No faculties found with the provided emails");
            }
            assignedTo = faculties.map(faculty => faculty._id);
        } else {
            throw new ApiError(400, "Invalid model specified");
        }
        task.assignedTo = assignedTo;
    }

    await task.save();

    return res.status(200).json({
        status: 200,
        data: task,
        message: "Task updated successfully!"
    });
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.aggregate([
            {
                $lookup: {
                    from: 'faculties', // The collection name for faculty
                    localField: 'createdBy', // Field in the Task collection
                    foreignField: '_id', // Field in the Faculty collection
                    as: 'facultyDetails' // Output array field name
                }
            },
            {
                $unwind: {
                    path: '$facultyDetails',
                    preserveNullAndEmptyArrays: true // Keep tasks without a corresponding faculty
                }
            },
            {
                $project: {
                    _id: 1,
                    description: 1,
                    submitBy: 1,
                    createdBy: 1,
                    'facultyDetails.fullName': 1,
                    isForAll: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!tasks || tasks.length === 0) {
            throw new ApiError(404, "No tasks found");
        }

        return res.status(200).json(
            new ApiResponse(200, tasks, "All tasks fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching tasks");
    }
});

// Get tasks for a specific user
const getUserTasks = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const userTasks = await Task.find({
        $or: [
            { assignedTo: userId, onModel: 'User' },
            { isForAll: true }
        ]
    }).populate('submissions');

    if (!userTasks || userTasks.length === 0) {
        throw new ApiError(404, "No tasks found");
    }

    return res.status(200).json(
        new ApiResponse(200, userTasks, "Tasks fetched successfully!")
    );
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this task");
    }

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
        status: 200,
        message: "Task deleted successfully!"
    });
});

export {
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getUserTasks
};
