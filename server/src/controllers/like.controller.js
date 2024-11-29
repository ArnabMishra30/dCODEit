import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Faculty } from "../models/faculty.model.js"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is invalid");
    }

    // Ensure the ID belongs to a video
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Determine ownerModel based on logged-in user
    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    // Find if the video is already liked by the user
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
        likedByModel: ownerModel
    });

    if (existingLike) {
        // If the video is already liked, unlike it
        await Like.deleteOne({
            _id: existingLike._id
        });
        res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
    } else {
        // If the video is not liked, like it
        const like = await Like.create({
            video: videoId,
            likedBy: req.user._id,
            likedByModel: ownerModel
        });

        if (!like) {
            throw new ApiError(500, "Something went wrong while liking the video");
        }

        res.status(201).json(new ApiResponse(201, "Video liked successfully"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment Id is invalid");
    }

    // Ensure the ID belongs to a comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
        likedByModel: ownerModel
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        res.status(200).json(new ApiResponse(200, "Comment unliked successfully"));
    } else {
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id,
            likedByModel: ownerModel
        });

        if (!like) {
            throw new ApiError(500, "Something went wrong while liking the comment");
        }

        res.status(201).json(new ApiResponse(201, "Comment liked successfully"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet Id is invalid");
    }

    // Ensure the ID belongs to a tweet
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
        likedByModel: ownerModel
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        res.status(200).json(new ApiResponse(200, "Tweet unliked successfully"));
    } else {
        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
            likedByModel: ownerModel
        });

        if (!like) {
            throw new ApiError(500, "Something went wrong while liking the tweet");
        }

        res.status(201).json(new ApiResponse(201, "Tweet liked successfully"));
    }
});

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
// })

const getLikedVideos = asyncHandler(async (req, res) => {
    // Determine ownerModel based on logged-in user
    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    // Fetch all likes where the likedBy field matches the current user and the likedByModel matches the user's role
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        likedByModel: ownerModel,
        video: { $exists: true } // Ensure that it is a like for a video
    }).populate('video');

    // Check if liked videos were found
    if (!likedVideos || likedVideos.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No liked videos found"));
    }

    res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

const getLikedTweets = asyncHandler(async (req, res) => {
    // Determine ownerModel based on logged-in user
    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    // Fetch all likes where the likedBy field matches the current user and the likedByModel matches the user's role
    const likedTweets = await Like.find({
        likedBy: req.user._id,
        likedByModel: ownerModel,
        tweet: { $exists: true } // Ensure that it is a like for a tweet
    }).populate('tweet');

    // Check if liked tweets were found
    if (!likedTweets || likedTweets.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No liked tweets found"));
    }

    res.status(200).json(new ApiResponse(200, likedTweets, "Liked tweets fetched successfully"));
});

const getTweetLikeStatus = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet Id is invalid");
    }

    // Ensure the ID belongs to a tweet
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    let ownerModel;
    if (req.user.role === 'student') {
        ownerModel = 'User';
    } else if (req.user.role === 'teacher') {
        ownerModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    // Check if the tweet is liked by the user
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
        likedByModel: ownerModel
    });

    res.status(200).json({
        liked: !!existingLike
    });
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedTweets,
    getTweetLikeStatus
}