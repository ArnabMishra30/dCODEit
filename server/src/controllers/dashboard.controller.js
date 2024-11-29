import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Faculty } from "../models/faculty.model.js"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    try {
        // Total likes
        const allLikes = await Like.aggregate([
            {
                $match: {
                    likedBy: userId
                },
            },
            {
                $group: {
                    _id: null,
                    totalVideoLikes: {
                        $sum: {
                            $cond: [
                                { $ifNull: ["$video", false] },
                                1,
                                0
                            ]
                        }
                    },
                    totalTweetLikes: {
                        $sum: {
                            $cond: [
                                { $ifNull: ["$tweet", false] },
                                1,
                                0
                            ]
                        }
                    },
                    totalCommentLikes: {
                        $sum: {
                            $cond: [
                                { $ifNull: ["$comment", false] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Total subscribers
        const allSubscribes = await Subscription.aggregate([
            {
                $match: {
                    channel: userId
                }
            },
            {
                $count: "subscribers"
            }
        ]);

        // Total videos
        const allVideo = await Video.aggregate([
            {
                $match: {
                    owner: userId
                }
            },
            {
                $count: "Videos"
            }
        ]);

        // Total views
        const allViews = await Video.aggregate([
            {
                $match: {
                    videoOwner: userId
                }
            },
            {
                $group: {
                    _id: null,
                    allVideosViews: {
                        $sum: "$views"
                    }
                }
            }
        ]);

        // Check aggregation results and handle cases where no documents are found
        const totalSubscribers = (allSubscribes && allSubscribes.length > 0) ? allSubscribes[0].subscribers : 0;
        const totalVideos = (allVideo && allVideo.length > 0) ? allVideo[0].Videos : 0;
        const totalVideoViews = (allViews && allViews.length > 0) ? allViews[0].allVideosViews : 0;
        const totalVideoLikes = (allLikes && allLikes.length > 0) ? allLikes[0].totalVideoLikes : 0;
        const totalTweetLikes = (allLikes && allLikes.length > 0) ? allLikes[0].totalTweetLikes : 0;
        const totalCommentLikes = (allLikes && allLikes.length > 0) ? allLikes[0].totalCommentLikes : 0;

        const stats = {
            Subscribers: totalSubscribers,
            totalVideos: totalVideos,
            totalVideoViews: totalVideoViews,
            totalVideoLikes: totalVideoLikes,
            totalTweetLikes: totalTweetLikes,
            totalCommentLikes: totalCommentLikes
        };

        // Return response
        return res.status(200).json(
            new ApiResponse(
                200,
                stats,
                "Fetching channel stats successfully!"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                "An error occurred while fetching channel stats"
            )
        );
    }
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const allVideo = await Video.find({
        owner: req.user._id
    })

    if (!allVideo) {
        throw new ApiError(
            500,
            "something went wrong while fetching channel all videos!!"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            allVideo,
            "All videos fetched successfully !!"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}