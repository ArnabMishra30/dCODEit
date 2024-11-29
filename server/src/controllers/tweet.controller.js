import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { Faculty } from "../models/faculty.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js" //uploading file on cloudinary

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { title, content } = req.body
    // if (!content || content?.trim() === "") {
    //     throw new ApiError(400, "content is required")
    // }

    if (title === "") {
        throw new ApiError(400, "title is requred")
    }
    if (content === "") {
        throw new ApiError(400, "content is requred")
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

    // const tweetImageLocalPath = req.files?.image[0]?.path; //getting the path of the image
    // const tweetImage = await uploadOnCloudinary(tweetImageLocalPath);
    // if (!tweetImage) {
    //     throw new ApiError(400, "Image is not given")
    // }

    let tweetImage;
    if (req.file) {
        const tweetImageLocalPath = req.file.path;
        tweetImage = await uploadOnCloudinary(tweetImageLocalPath);

        if (!tweetImage) {
            throw new ApiError(400, "Image upload failed");
        }
    }


    ///creating tweet
    const tweet = await Tweet.create({
        title,
        content,
        image: tweetImage ? tweetImage.url : null,
        // user: req.user._id,
        owner: req.user._id,
        ownerModel,
    })

    if (!tweet) {
        throw new ApiError(400, "Tweet not created")
    }

    // return responce
    return res.status(201).json(
        new ApiResponse(200, tweet, "tweet created successfully!!")
    );
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    //validate user id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    //fetch tweets of the specified user
    const tweets = await Tweet.find({ owner: userId });
    if (!tweets || tweets.length === 0) {
        throw new ApiError(400, "No tweets found")
    }

    //return response
    return res.status(200).json(
        new ApiResponse(200, tweets, "tweets fetched successfully!!")
    );

})

const getAllTweets = asyncHandler(async (req, res) => {
    // Fetch all tweets
    const tweets = await Tweet.find();

    if (!tweets || tweets.length === 0) {
        throw new ApiError(404, "No tweets found");
    }

    // Return response
    return res.status(200).json(
        new ApiResponse(200, tweets, "All tweets fetched successfully")
    );
});

const getTweetById = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    // Fetch the tweet by ID
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Return response
    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { title, content } = req.body;

    //validate input
    if (!title || title.trim() === "") {
        throw new ApiError(400, "title is required")
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "content is required")
    }
    //find the tweet
    const tweet = await Tweet.findById(tweetId);
    // const tweet = await Tweet.findById(tweetId).populate('owner');
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    //check if the logged in user is owner of the tweet or not
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    let updatedData = {
        title,
        content
    };

    if (req.file) {
        // If a new image is uploaded, handle the upload
        const tweetImageLocalPath = req.file.path;
        const tweetImage = await uploadOnCloudinary(tweetImageLocalPath);

        if (!tweetImage) {
            throw new ApiError(400, "Image upload failed");
        }

        // Optionally delete the old image from Cloudinary if it exists
        if (tweet.image) {
            await deleteFromCloudinary(tweet.image);
        }

        updatedData.image = tweetImage.url;
    }

    // Update the tweet
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, updatedData, { new: true });

    if (!updatedTweet) {
        throw new ApiError(400, "Tweet not updated");
    }

    // Return response
    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    );

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    //find the tweet
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    //check if the current logged in user is owner of the tweet or not??
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    // Delete the tweet from database
    await Tweet.findByIdAndDelete(tweetId);

    // Optionally delete the tweet image from Cloudinary if it exists
    if (tweet.image) {
        await deleteFromCloudinary(tweet.image);
    }

    // Return response
    return res.status(200).json(
        new ApiResponse(200, null, "Tweet deleted successfully")
    );

})

export {
    createTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
    deleteTweet,
    getTweetById
}