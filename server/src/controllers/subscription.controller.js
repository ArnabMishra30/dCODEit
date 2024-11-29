import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Faculty } from "../models/faculty.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is invalid");
    }

    // Determine subscriber model based on logged-in user
    let subscriberModel;
    if (req.user.role === 'student') {
        subscriberModel = 'User';
    } else if (req.user.role === 'teacher') {
        subscriberModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    // Ensure the user is not subscribing to their own channel
    if (req.user._id.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    // Find the channel to determine its model
    let channelModel;
    const userChannel = await User.findById(channelId);
    const facultyChannel = await Faculty.findById(channelId);

    if (userChannel) {
        channelModel = 'User';
    } else if (facultyChannel) {
        channelModel = 'Faculty';
    } else {
        throw new ApiError(404, "Channel not found");
    }

    // Determine channelOfModel based on the type of channel found
    const channelOfModel = channelModel;

    // Find if the subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        subscribedByModel: subscriberModel,
        channel: channelId,
        channelOfModel: channelOfModel
    });

    if (existingSubscription) {
        // If the subscription exists, unsubscribe
        await Subscription.deleteOne({
            _id: existingSubscription._id
        });
        res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
    } else {
        // If the subscription does not exist, subscribe
        const subscription = await Subscription.create({
            subscriber: req.user._id,
            subscribedByModel: subscriberModel,
            channel: channelId,
            channelOfModel: channelOfModel
        });

        if (!subscription) {
            throw new ApiError(500, "Something went wrong while subscribing");
        }

        res.status(201).json(new ApiResponse(201, "Subscribed successfully"));
    }
});

// controller to return subscriber list of a channel
// Controller to return subscriber list of a channel
// const getUserChannelSubscribers = asyncHandler(async (req, res) => {
//     const { channelId } = req.params;

//     // Validate channelId
//     if (!mongoose.isValidObjectId(channelId)) {
//         throw new ApiError(400, "Channel Id is invalid");
//     }

//     // Determine ownerModel based on logged-in user
//     let ownerModel;
//     if (req.user.role === 'student') {
//         ownerModel = 'User';
//     } else if (req.user.role === 'teacher') {
//         ownerModel = 'Faculty';
//     } else {
//         throw new ApiError(403, "Unauthorized: User role not recognized");
//     }

//     try {
//         // Aggregate pipeline to fetch subscribers
//         const subscribers = await Subscription.aggregate([
//             {
//                 $match: {
//                     channel: mongoose.Types.ObjectId(channelId),
//                     channelOfModel: ownerModel // Match based on the ownerModel
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'subscriber',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'faculties',
//                     localField: 'subscriber',
//                     foreignField: '_id',
//                     as: 'facultyDetails'
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0, // Exclude _id from results
//                     userDetails: 1, // Include user details
//                     facultyDetails: 1 // Include faculty details
//                 }
//             }
//         ]);

//         res.status(200).json(subscribers);
//     } catch (error) {
//         throw new ApiError(500, "Error fetching subscribers", error);
//     }
// });

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is invalid");
    }

    // Ensure the logged-in user is requesting their own channel's subscribers
    if (req.user._id.toString() !== channelId) {
        throw new ApiError(403, "Unauthorized: You can only view subscribers for your own channel");
    }

    // Determine channel model based on logged-in user
    let channelModel;
    if (req.user.role === 'student') {
        channelModel = 'User';
    } else if (req.user.role === 'teacher') {
        channelModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const subscribers = await Subscription.find({
        channel: channelId,
        channelOfModel: channelModel
    }).populate('subscriber');

    res.status(200).json(new ApiResponse(200, "Subscribers retrieved successfully", subscribers));
});


// const getUserChannelSubscribers = asyncHandler(async (req, res) => {
//     const { channelId } = req.params;

//     console.log(channelId);

//     if (!isValidObjectId(channelId)) {
//         throw new ApiError(400, "Channel Id is invalid");
//     }

//     // Convert channelId to ObjectId
//     // channelId = mongoose.Types.ObjectId(channelId);

//     // Determine ownerModel based on logged-in user
//     let ownerModel;
//     if (req.user.role === 'student') {
//         ownerModel = 'User';
//     } else if (req.user.role === 'teacher') {
//         ownerModel = 'Faculty';
//     } else {
//         throw new ApiError(403, "Unauthorized: User role not recognized");
//     }

//     try {
//         // Aggregate pipeline to fetch subscribers
//         const subscribers = await Subscription.aggregate([
//             {
//                 $match: {
//                     channel: channelId,
//                     channelOfModel: ownerModel
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'subscriber',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'faculties',
//                     localField: 'subscriber',
//                     foreignField: '_id',
//                     as: 'facultyDetails'
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0, // Exclude _id from results
//                     userDetails: 1, // Include user details
//                     facultyDetails: 1 // Include faculty details
//                 }
//             }
//         ]);

//         res.status(200).json(subscribers);
//     } catch (error) {
//         throw new ApiError(500, "Error fetching subscribers", error);
//     }
// });

// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    // Determine subscriber model based on logged-in user
    let subscriberModel;
    if (req.user.role === 'student') {
        subscriberModel = 'User';
    } else if (req.user.role === 'teacher') {
        subscriberModel = 'Faculty';
    } else {
        throw new ApiError(403, "Unauthorized: User role not recognized");
    }

    const subscriptions = await Subscription.find({
        subscriber: channelId,
        subscribedByModel: subscriberModel
    }).populate('channel');

    res.status(200).json(new ApiResponse(200, "Subscribed channels retrieved successfully", subscriptions));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}