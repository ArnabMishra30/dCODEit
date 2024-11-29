import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const addVideoComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { videoId } = req.params;

    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment is required");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "This video ID is not valid");
    }

    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const videoComment = await Comment.create({
        content: comment,
        video: videoId,
        owner: req.user._id,
        ownerModel,
    });

    if (!videoComment) {
        throw new ApiError(500, "Video comment not created");
    }

    // retern the response 
    return res.status(201).json(
        new ApiResponse(200, videoComment, "video uploaded successfully!!")
    );

});

const addTweetComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { tweetId } = req.params;

    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "This tweet ID is not valid");
    }

    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const tweetComment = await Comment.create({
        content: comment,
        tweet: tweetId,
        owner: req.user._id,
        ownerModel,
    });

    if (!tweetComment) {
        throw new ApiError(500, "Tweet comment not created");
    }

    // retern the response 
    return res.status(201).json(
        new ApiResponse(200, tweetComment, "Tweet comment uploaded successfully!!")
    );

});

//this is for comment reply
const addCommentReply = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { parentCommentId } = req.params;

    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment is required");
    }

    if (!isValidObjectId(parentCommentId)) {
        throw new ApiError(400, "This parent comment ID is not valid");
    }

    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
        throw new ApiError(404, "Parent comment not found");
    }

    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const commentReply = await Comment.create({
        content: comment,
        parentComment: parentCommentId,
        owner: req.user._id,
        ownerModel,
    });

    if (!commentReply) {
        throw new ApiError(500, "Comment reply not created");
    }

    return res.status(201).json(
        new ApiResponse(200, commentReply, "Comment reply added successfully!")
    );
});

// const getVideoComments = asyncHandler(async (req, res) => {
//     //TODO: get all comments for a video
//     const { videoId } = req.params
//     const { page = 1, limit = 10 } = req.query

//     if (!isValidObjectId(videoId)) {
//         throw new ApiError(400, "this videoId is not valid")
//     }

//     //find the video in database
//     const video = await Video.findById(videoId)

//     if (!video) {
//         throw new ApiError(404, "video not found")
//     }

//     //match and find ALL comments
//     const aggregateComments = await Comment.aggregate([
//         {
//             $match: {
//                 video: new mongoose.Types.ObjectId(videoId)
//             }
//         }
//     ])

//     Comment.aggregatePaginate(aggregateComments, {
//         page,
//         limit
//     })
//         .then((result) => {
//             return res.status(201).json(
//                 new ApiResponse(200, result, "VideoComments fetched  successfully!!"))
//         })
//         .catch((error) => {
//             throw new ApiError(500, "something went wrong while fetching video Comments", error)
//         })

// })

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "This videoId is not valid");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const aggregatePipeline = [
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        {
            $lookup: {
                from: 'faculties',
                localField: 'owner',
                foreignField: '_id',
                as: 'facultyDetails',
            },
        },
        {
            $addFields: {
                ownerDetails: {
                    $cond: {
                        if: { $eq: ["$ownerModel", 'User'] },
                        then: { $arrayElemAt: ["$userDetails", 0] },
                        else: { $arrayElemAt: ["$facultyDetails", 0] },
                    },
                },
            },
        },
        {
            $project: {
                userDetails: 0,
                facultyDetails: 0,
            },
        },
    ];

    // Apply pagination
    Comment.aggregatePaginate(Comment.aggregate(aggregatePipeline), { page, limit })
        .then((result) => {
            return res.status(200).json(
                new ApiResponse(200, result, "Video comments fetched successfully!")
            );
        })
        .catch((error) => {
            throw new ApiError(500, "Something went wrong while fetching video comments", error);
        });
});

// const getTweetComments = asyncHandler(async (req, res) => {
//     const { tweetId } = req.params;
//     const { page = 1, limit = 10 } = req.query;

//     if (!isValidObjectId(tweetId)) {
//         throw new ApiError(400, "This tweet ID is not valid");
//     }

//     const aggregatePipeline = [
//         { $match: { tweet: new mongoose.Types.ObjectId(tweetId) } },
//         //this first lookup is for reply to a comment
//         {
//             $lookup: {
//                 from: 'comments',
//                 localField: '_id',
//                 foreignField: 'parentComment',
//                 as: 'replies',
//             },
//         },
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'owner',
//                 foreignField: '_id',
//                 as: 'userDetails',
//             },
//         },
//         {
//             $lookup: {
//                 from: 'faculties',
//                 localField: 'owner',
//                 foreignField: '_id',
//                 as: 'facultyDetails',
//             },
//         },
//         {
//             $addFields: {
//                 ownerDetails: {
//                     $cond: {
//                         if: { $eq: ["$ownerModel", 'User'] },
//                         then: { $arrayElemAt: ["$userDetails", 0] },
//                         else: { $arrayElemAt: ["$facultyDetails", 0] },
//                     },
//                 },
//             },
//         },
//         {
//             $project: {
//                 userDetails: 0,
//                 facultyDetails: 0,
//             },
//         },
//     ];

//     // Apply pagination using aggregatePaginate
//     Comment.aggregatePaginate(Comment.aggregate(aggregatePipeline), { page, limit })
//         .then((result) => {
//             return res.status(200).json(
//                 new ApiResponse(200, result, "Tweet comments fetched successfully!")
//             );
//         })
//         .catch((error) => {
//             throw new ApiError(500, "Something went wrong while fetching tweet comments", error);
//         });
// });

const getTweetComments = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "This tweet ID is not valid");
    }

    const aggregatePipeline = [
        { $match: { tweet: new mongoose.Types.ObjectId(tweetId), parentComment: null } }, // Fetch top-level comments
        // Recursively fetch replies
        {
            $graphLookup: {
                from: "comments",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentComment",
                as: "replies",
                depthField: "depth" // Optional: use this field if you want to track depth
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        {
            $lookup: {
                from: 'faculties',
                localField: 'owner',
                foreignField: '_id',
                as: 'facultyDetails',
            },
        },
        {
            $addFields: {
                ownerDetails: {
                    $cond: {
                        if: { $eq: ["$ownerModel", 'User'] },
                        then: { $arrayElemAt: ["$userDetails", 0] },
                        else: { $arrayElemAt: ["$facultyDetails", 0] },
                    },
                },
            },
        },
        {
            $project: {
                userDetails: 0,
                facultyDetails: 0,
            },
        },
    ];

    // Apply pagination using aggregatePaginate
    Comment.aggregatePaginate(Comment.aggregate(aggregatePipeline), { page, limit })
        .then((result) => {
            return res.status(200).json(
                new ApiResponse(200, result, "Tweet comments fetched successfully!")
            );
        })
        .catch((error) => {
            throw new ApiError(500, "Something went wrong while fetching tweet comments", error);
        });
});

const updateVideoComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { newComment } = req.body;

    // Validate commentId
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find the comment in database
    const comment = await Comment.findById(commentId);

    // Check if comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if the current user has permission to update the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this comment");
    }

    // Update the comment with new content
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content: newComment } },
        { new: true } // Return the updated document
    );

    // Handle case where update did not succeed
    if (!updatedComment) {
        throw new ApiError(500, "Failed to update comment");
    }

    // Return success response
    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});

const updateTweetComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { newComment } = req.body;

    try {
        // Validate commentId
        if (!mongoose.isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid comment ID");
        }

        // Find the comment in database
        const comment = await Comment.findById(commentId);

        // Check if comment exists
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }

        // Check if the current user has permission to update the comment
        if (comment.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You don't have permission to update this comment");
        }

        // Update the comment with new content
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { content: newComment } },
            { new: true } // Return the updated document
        );

        // Handle case where update did not succeed
        if (!updatedComment) {
            throw new ApiError(500, "Failed to update comment");
        }

        // Return success response
        return res.status(200).json(
            new ApiResponse(200, updatedComment, "Comment updated successfully")
        );
    } catch (error) {
        // Handle errors gracefully
        throw new ApiError(500, "Error updating comment", error);
    }
});

// const deleteVideoComment = asyncHandler(async (req, res) => {
//     // TODO: delete a comment
//     const { commentId } = req.params;

//     try {
//         // Validate commentId
//         if (!mongoose.isValidObjectId(commentId)) {
//             throw new ApiError(400, "Invalid comment ID");
//         }

//         // Find the comment in database
//         const comment = await Comment.findById(commentId);

//         // Check if comment exists
//         if (!comment) {
//             throw new ApiError(404, "Comment not found");
//         }

//         // Check if the current user has permission to delete the comment
//         if (comment.owner.toString() !== req.user._id.toString()) {
//             throw new ApiError(403, "You don't have permission to delete this comment");
//         }

//         // Delete the comment
//         const deletedComment = await Comment.findByIdAndDelete(commentId);

//         // Handle case where delete did not succeed
//         if (!deletedComment) {
//             throw new ApiError(500, "Failed to delete comment");
//         }

//         // Return success response
//         return res.status(200).json(
//             new ApiResponse(200, {}, "Comment deleted successfully")
//         );
//     } catch (error) {
//         // Log the error for debugging
//         console.error("Error deleting comment:", error);

//         // Handle errors gracefully
//         throw new ApiError(500, "Error deleting comment", error);
//     }
// });

//There is a problem in delete tweet and video comment that we can able to delete any comment from it
// const deleteTweetComment = asyncHandler(async (req, res) => {
//     const { commentId } = req.params;

//     try {
//         // Validate commentId
//         if (!mongoose.isValidObjectId(commentId)) {
//             throw new ApiError(400, "Invalid comment ID");
//         }

//         // Find the comment in database
//         const comment = await Comment.findById(commentId);

//         // Check if comment exists
//         if (!comment) {
//             throw new ApiError(404, "Comment not found");
//         }

//         // Check if the current user has permission to delete the comment
//         if (comment.owner.toString() !== req.user._id.toString()) {
//             throw new ApiError(403, "You don't have permission to delete this comment");
//         }

//         // Delete the comment
//         const deletedComment = await Comment.findByIdAndDelete(commentId);

//         // Handle case where delete did not succeed
//         if (!deletedComment) {
//             throw new ApiError(500, "Failed to delete comment");
//         }

//         // Return success response
//         return res.status(200).json(
//             new ApiResponse(200, {}, "Comment deleted successfully")
//         );
//     } catch (error) {
//         // Log the error for debugging
//         console.error("Error deleting comment:", error);

//         // Handle errors gracefully
//         throw new ApiError(500, "Error deleting comment", error);
//     }
// });

const deleteVideoComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find the comment in database
    const comment = await Comment.findById(commentId);

    // Check if comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Ensure the comment belongs to a video and not a tweet
    if (!comment.video) {
        throw new ApiError(403, "This comment does not belong to a video");
    }

    // Check if the current user has permission to delete the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this comment");
    }

    // Delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    // Handle case where delete did not succeed
    if (!deletedComment) {
        throw new ApiError(500, "Failed to delete comment");
    }

    // Return success response
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

//There is a problem in delete tweet and video comment that we can able to delete any comment from it so that this two above and down is the solution

const deleteTweetComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Validate commentId
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find the comment in database
    const comment = await Comment.findById(commentId);

    // Check if comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Ensure the comment belongs to a tweet and not a video
    if (!comment.tweet) {
        throw new ApiError(403, "This comment does not belong to a tweet");
    }

    // Check if the current user has permission to delete the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this comment");
    }

    // Delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    // Handle case where delete did not succeed
    if (!deletedComment) {
        throw new ApiError(500, "Failed to delete comment");
    }

    // Return success response
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

export {
    getVideoComments,
    addVideoComment,
    addCommentReply,
    updateVideoComment,
    deleteVideoComment,
    addTweetComment,
    updateTweetComment,
    getTweetComments,
    deleteTweetComment
}