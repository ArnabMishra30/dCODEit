import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Faculty } from "../models/faculty.model.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    //TODO: create playlist
    if ((!name || name?.trim() === "") || (!description || description?.trim() === "")) {
        throw new ApiError(400, "name and deccription both are required")
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
    // creating playlist 
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        ownerModel
    })
    if (!playlist) {
        throw new ApiError(500, "something went wrong while creating playlist")
    }
    // return responce
    return res.status(201).json(
        new ApiResponse(200, playlist, "playlist created successfully!!")
    );
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid UserId")
    }
    //fetch playlists of the specified user
    const playlist = await Playlist.find({ owner: userId });
    if (!playlist || playlist.length === 0) {
        throw new ApiError(400, "No playlist found")
    }

    //return response
    return res.status(200).json(
        new ApiResponse(200, playlist, "tweets fetched successfully!!")
    );
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    console.log("playlistId", playlistId)
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "This playlist id is not valid")
    }
    // find user in database 
    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (!playlist) {
        throw new ApiError(500, "something went wrong while fetching playlist")
    }

    // return responce
    return res.status(201).json(
        new ApiResponse(200, playlist, "playlist fetched  successfully!!"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }

    //find playlist in db
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    //check the owner of the playlist is currently loggedin user or not!!
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to add video in this playlist!");
    }

    //find video in db
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // if video already exists in playlist 
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "video already exists in this playlist!!");
    }

    // push video to playlist
    const addedToPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!addedToPlaylist) {
        throw new ApiError(500, "something went wrong while added video to playlist !!");
    }

    // return responce
    return res.status(201).json(
        new ApiResponse(200, addedToPlaylist, " added video in playlist successfully!!"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlalistId")
    } if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }
    if (playlist.owner.toString() != req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to remove video in this playlist!");
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    //check video exist or not in playlist
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "video not found in this playlist!!")
    }
    // remove video from playlist
    const removedVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!removedVideo) {
        throw new ApiError(500, "something went wrong while removed video to playlist !!");
    }

    // return responce
    return res.status(200).json(
        new ApiResponse(200, removedVideo, "video removed from playlist successfully!!"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "This playlist id is not valid")
    }

    const playlist = await Playlist.findById(playlistId)

    console.log("playlist", playlist)

    if (!playlist) {
        throw new ApiError(404, "no playlist found!");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this playlist!");
    }
    const deletePlaylist = await Playlist.deleteOne({
        _id: playlistId
    })

    if (!deletePlaylist) {
        throw new ApiError(500, "something went wrong while deleting playlist")
    }

    // return responce
    return res.status(201).json(
        new ApiResponse(200, deletePlaylist, "playlist deleted successfully!!"))

})

// const updatePlaylist = asyncHandler(async (req, res) => {
//     const { playlistId } = req.params
//     const { name, description } = req.body
//     //TODO: update playlist

//     if (!isValidObjectId(playlistId)) {
//         throw new ApiError(400, "This playlist id is not valid")
//     }

//     // Check if either name or description is provided
//     if (!name && !description) {
//         throw new ApiError(400, "Either name or description is required");
//     }
//     // if any one is provided
//     // if (!((!name || name?.trim() === "") || (!name || description?.trim() === ""))) {
//     //     throw new ApiError(400, "Either name or description is required");
//     // }
//     const playlist = await Playlist.findById(playlistId)
//     if (playlist.owner.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, "You don't have permission to update this playlist!");
//     }
//     const updatePlaylist = await Playlist.findByIdAndUpdate(
//         playlistId,
//         {
//             $set: {
//                 name: name,
//                 description: description
//             }
//         },
//         {
//             new: true
//         }
//     )
//     if (!updatePlaylist) {
//         throw new ApiError(500, "something went wrong while updating playlist!!")
//     }

//     // return responce
//     return res.status(201).json(
//         new ApiResponse(200, updatePlaylist, "playlist updated successfully!!"))

// })

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "This playlist id is not valid");
    }

    // Check if either name or description is provided
    if (!name && !description) {
        throw new ApiError(400, "Either name or description is required");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this playlist!");
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: updateFields
        },
        {
            new: true
        }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while updating playlist!");
    }

    // Return response
    return res.status(201).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully!"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}