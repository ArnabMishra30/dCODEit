import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Faculty } from "../models/faculty.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

// const getAllVideos = asyncHandler(async (req, res) => {
//     const {
//         page = 1,
//         limit = 10,
//         query = "/^video/",
//         sortBy = "createdAt",
//         sortType = 1,
//         userId = req.user._id,
//     } = req.query;
    
//     // Determine owner model and query based on user role
//     // let ownerModel, ownerQuery;
//     // if (req.user.role === "teacher") {
//     //     ownerModel = Faculty;
//     //     ownerQuery = { teacherId: mongoose.Types.ObjectId(userId) }; // Cast userId to ObjectId
//     // } else {
//     //     ownerModel = User;
//     //     ownerQuery = { _id: mongoose.Types.ObjectId(userId) }; // Cast userId to ObjectId
//     // }

//     // find user in db based on role
//     // const user = await ownerModel.findOne(ownerQuery);

//     // if (!user) {
//     //     throw new ApiError(404, "User not found");
//     // }

//     const getAllVideosAggregate = await Video.aggregate([
//         {
//             $match: {
//                 owner: mongoose.Types.ObjectId(userId),
//                 ownerModel: req.user.role === "teacher" ? "Faculty" : "User",
//                 $or: [
//                     { title: { $regex: query, $options: 'i' } },
//                     { description: { $regex: query, $options: 'i' } }
//                 ]
//             }
//         },
//         {
//             $sort: {
//                 [sortBy]: sortType
//             }
//         },
//         {
//             $skip: (page - 1) * limit
//         }
//     ]);

//     Video.aggregatePaginate(getAllVideosAggregate, { page, limit })
//         .then((result) => {
//             return res.status(200).json(
//                 new ApiResponse(
//                     200,
//                     result,
//                     "Fetched all videos successfully"
//                 )
//             );
//         })
//         .catch((error) => {
//             console.error("Error while fetching all videos:", error);
//             throw new ApiError(500, "Failed to fetch videos");
//         });
// });

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "/^video/",
        sortBy = "createdAt",
        sortType = 1,
    } = req.query;

    const userId = req.user._id;

    const getAllVideosAggregate = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                ownerModel: req.user.role === "teacher" ? "Faculty" : "User",
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }
        },
        {
            $sort: {
                [sortBy]: sortType
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit // Ensure we limit the number of documents
        }
    ]);

    Video.aggregatePaginate(getAllVideosAggregate, { page, limit })
        .then((result) => {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Fetched all videos successfully"
                )
            );
        })
        .catch((error) => {
            console.error("Error while fetching all videos:", error);
            throw new ApiError(500, "Failed to fetch videos");
        });
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished = true } = req.body;
    if (!title || title?.trim() === "") {
        throw new ApiError(400, "Title content is required")
    }
    if (!description || description?.trim() === "") {
        throw new ApiError(400, "description content is required")
    }
    // local path 
    const videoFileLocalPath = req.files?.videoFile?.[0].path
    const thumbnailFileLocalPath = req.files?.thumbnail?.[0].path
    if (!videoFileLocalPath) {
        throw new ApiError(400, "video file missing !!")
    }

    // upload on cloudinary 
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath)
    if (!videoFile) {
        throw new ApiError(500, "something went wrong while uploading video file on cloudinary")
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
    // strore in the database 
    const video = Video.create({
        videoFile: {
            public_id: videoFile?.public_id,
            url: videoFile?.url
        },
        thumbnail: {
            public_id: thumbnail?.public_id,
            url: thumbnail?.url
        },
        title,
        description,
        isPublished,
        owner: req.user._id,
        ownerModel,
        duration: videoFile?.duration
    })

    if (!video) {
        throw new ApiError(500, "something went wrong while store the video in database")
    }

    // retern the response 
    return res.status(201).json(
        new ApiResponse(200, video, "video uploaded successfully!!")
    );

});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    // Check if videoId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    // Find the video by its ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
})

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: update video details like title, description, thumbnail
//     const { title, description } = req.body;
//     const thumbnailLocalPath = req.file?.path;
//     // Validate videoId
//     if (!mongoose.Types.ObjectId.isValid(videoId)) {
//         throw new ApiError(400, 'Invalid video ID');
//     }

//     // Find the video
//     const video = await Video.findById(videoId);

//     if (!video) {
//         throw new ApiError(404, 'Video not found');
//     }

//     // Check if the authenticated user is the owner of the video
//     if (video.owner.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, 'You do not have permission to update this video');
//     }

//     let updatedFields = {};

//     // Update fields if provided
//     if (title) updatedFields.title = title;
//     if (description) updatedFields.description = description;

//     let oldThumbnailUrl = null;
//     // If a new thumbnail is provided, upload it to Cloudinary and update the URL
//     if (thumbnailLocalPath) {
//         const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
//         if (!thumbnail.url) {
//             throw new ApiError(400, 'Error while uploading thumbnail');
//         }

//         // Store the old thumbnail URL to delete later
//         oldThumbnailUrl = video.thumbnail;
//         updatedFields.thumbnail = thumbnail.url;

//          // Update the video details
//         const updateVideo = await Video.findByIdAndUpdate(
//             videoId,
//             {
//                 $set: updatedFields,
//                 $currentDate: { updatedAt: true } // Automatically set the `updatedAt` field to the current date
//             },
//             {
//                 new: true
//             }
//         );
//     }

//     // After successful update, delete the old thumbnail from Cloudinary if a new one was uploaded
//     if (oldThumbnailUrl) {
//         const publicId = oldThumbnailUrl.split('/').pop().split('.')[0]; // Extract publicId from URL
//         await deleteFromCloudinary(publicId);
//     }
    
//     return res
//         .status(200)
//         .json(new ApiResponse(200, updateVideo, 'Video updated successfully'));
// })

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailFileLocalPath = req.file?.path;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "this video id is not valid")
    }

   // if any feild not provide
   if(
    !(thumbnailFileLocalPath || !(!title || title?.trim() === "") || !(!description || description?.trim() === ""))){
        throw new ApiError(400, "update fields are required")
    }

    //find video
    const previousVideo = await Video.findOne(
        {
            _id: videoId
        }
    )
    if(!previousVideo){
        throw new ApiError(404, "video not found")
    }
    //update video
    let updateFields = {
        $set:{
            title,
            description,
        }
    }

    // if thumbnail provided delete the previous one and upload new on 
    let thumbnailUploadOnCloudinary;
    if(thumbnailFileLocalPath){
        await deleteFromCloudinary(previousVideo.thumbnail?.public_id)

        // upload new one 
         thumbnailUploadOnCloudinary = await uploadOnCloudinary(thumbnailFileLocalPath);

        if(!thumbnailUploadOnCloudinary){
            throw new ApiError(500, "something went wrong while updating thumbnail on cloudinary !!")
        }

        updateFields.$set = {
            public_id: thumbnailUploadOnCloudinary.public_id,
            url: thumbnailUploadOnCloudinary.url
        }
    }

    const updatedVideoDetails = await Video.findByIdAndUpdate(
        videoId,
        updateFields,
        {
            new: true
        }
    )

    if(!updatedVideoDetails){
        throw new ApiError(500, "something went wrong while updating video details");
    }

    //retrun responce
    return res.status(200).json(new ApiResponse(
        200,
        { updatedVideoDetails },
        "Video details updated successfully!"
    ));

});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "ythis video id is not valid")
    }
    const video = await Video.findById(
        {
            _id: videoId
        }
    )
    if(!video){
        throw new ApiError(404, "video not found")
    }
    //check if the current logged in user is the owner of the video or not!!!!!
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this video!");
    }
    // delete video and thumbnail in cloudinary
    if(video.videoFileLocalPath){
        await deleteFromCloudinary(video.videoFileLocalPath.public_id, "video")
    }

    if(video.thumbnailFileLocalPath){
        await deleteFromCloudinary(video.thumbnailFileLocalPath.public_id)
    }

    const deleteResponse = await Video.findByIdAndDelete(videoId)

    if(!deleteResponse){
        throw new ApiError(500, "something went wrong while deleting video")
    }
    // return responce
    return res.status(200).json(
    new ApiResponse(
            200,
            deleteResponse,
            "video deleted successfully!!"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "This video id is not valid")
    } 

     // find video in db
    const video = await Video.findById(
        {
            _id: videoId
        }
    )

    if(!video){
        throw new ApiError(404, "video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to toggle this video!")
    }
    // toggle video status
    video.isPublished = !video.isPublished

    await video.save({validateBeforeSave: false})

    //return responce 
    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "video toggle successfully!!"
        )
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
    
//2nd try code
// const getAllVideos = asyncHandler(async (req, res) => {
    //     // const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = 1, userId } = req.query
    
    //     //TODO: get all videos based on query, sort, pagination
    //     const {
    //         page = 1,
    //         limit = 10,
    //         query = "",
    //         sortBy = "createdAt",
    //         sortType = 1
    //     } = req.query
    
    //     // Default userId to current user's _id if not provided
    //     const userId = req.user._id;
    
    //     let ownerModel, ownerQuery;
    //     if (req.user.role === 'teacher') {
    //         ownerModel = Faculty;
    //         ownerQuery = { teacherId: userId };
    //     } else {
    //         ownerModel = User;
    //         ownerQuery = { _id: userId };
    //     }
    
    //     const user = await ownerModel.findById(ownerQuery);
    //     if (!user) {
    //         throw new ApiError(404, "User not found");
    //     }
    
    //     // Constructing regex query for title and description
    //     const regexQuery = query ? {
    //         $or: [
    //             { title: { $regex: query, $options: 'i' } },
    //             { description: { $regex: query, $options: 'i' } }
    //         ]
    //     } : {};
    
    //     // const getAllVideosAggregate = await Video.aggregate([
    //     //     {
    //     //         $match: {
    //     //             videoOwner: new mongoose.Types.ObjectId(userId),
    //     //             $or: [
    //     //                 { title: { $regex: query, $options: 'i' } },
    //     //                 { description: { $regex: query, $options: 'i' } }
    //     //             ]
    //     //         }
    //     //     },
    //     //     {
    //     //         $sort: {
    //     //             [sortBy]: sortType
    //     //         }
    //     //     },
    //     //     {
    //     //         $skip: (page - 1) * limit
    //     //     },
    //     //     {
    //     //         $limit: parseInt(limit)
    //     //     }
    //     // ])
    //     // Video.aggregatePaginate(getAllVideosAggregate, { page, limit })
    //     //     .then((result) => {
    //     //         return res
    //     //             .status(200)
    //     //             .json(
    //     //                 new ApiResponse(
    //     //                     200,
    //     //                     result,
    //     //                     "fetched all videos successfully !!"
    //     //                 )
    //     //             )
    //     //     })
    //     //     .catch((error) => {
    //     //         console.log("getting error while fetching all videos:", error)
    //     //         throw error
    //     //     })
    
    //     // Aggregate pipeline for fetching videos
    
    //     const aggregate = [
    //         {
    //             $match: {
    //                 videoOwner: mongoose.Types.ObjectId(userId),
    //                 ...regexQuery
    //             }
    //         },
    //         {
    //             $sort: {
    //                 [sortBy]: sortType
    //             }
    //         },
    //         {
    //             $skip: (page - 1) * limit
    //         },
    //         {
    //             $limit: parseInt(limit)
    //         }
    //     ];
    
    //     // Execute aggregate query
    //     const videos = await Video.aggregate(aggregate);
    
    //     // Response with pagination information
    //     res.status(200)
    //         .json(new ApiResponse(
    //             200,
    //             { videos },
    //             "Fetched all videos successfully"
    //         ));
// })