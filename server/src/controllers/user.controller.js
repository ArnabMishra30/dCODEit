//this asyncHandler is used to handle errors. as we have to use try catch many times to ignore that we have used this method of asyncHandler which is a separate file
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"//to handle errors in place to try catch everytime
import { User } from "../models/user.model.js"
import { Faculty } from "../models/faculty.model.js"
import { Subscription } from "../models/subscription.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js" //uploading file on cloudinary
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshTokens = async (userId, role) => {
    try {
        // const user = await User.findById(userId)
        let user;
        if (role === 'student') {
            user = await User.findById(userId);
        } else if (role === 'teacher') {
            user = await Faculty.findById(userId);
        }

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "somethinmg went wrong while generating accrss and refresh tokes")
    }
}

// Function to validate email format using regex
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Function to validate password (e.g., minimum length)
function isValidPassword(password) {
    return password.length >= 8; // Example: password must be at least 8 characters long
}

const registerUser = asyncHandler(async (req, res) => {
    //steps
    //get user details from frontend
    //perform validation like is not empty field??
    //check is user alkready exists
    //check for imgs and avatar
    //upload img on cloudinary
    //create user object
    //remove password and refresh token field from response
    //check for user successfully created or not
    //return response
    const { fullName, email, username, password, dept, role, year } = req.body
    // console.log("email: ", email);

    //checking if any field is empty
    /*
    if (fullName === "") {
        throw new ApiError(400, "Fullname is required")
    }
    if (email === "") {
        throw new ApiError(400, "Email is required")
    }
    if (username === "") {
        throw new ApiError(400, "Username is required")
    }
    if (password === "") {
        throw new ApiError(400, "Password is required")
    }
    */
    //    we can do above work in simple way given below
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // Validate email format
    if (!isValidEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Validate password
    if (!isValidPassword(password)) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    const existeduser = await User.findOne({
        //checking method using more than one parameters like here we wanted to check using email and userid which is unique
        $or: [{ username }, { email }]
    })
    const existingFaculty = await Faculty.findOne({
        $or: [{ email }, { username }]

    });

    if (existeduser || existingFaculty) {
        throw new ApiError(409, "User with this email or username already exists")
    }
    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path; //getting the path of the file
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; //getting the path of the file

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    //uploading image on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    // const user = await User.create({
    //     fullName,
    //     email,
    //     username: username.toLowerCase(),
    //     password,
    //     avatar: avatar.url, //avatar image's url should be stored in a string format
    //     coverImage: coverImage?.url || "", //if  coverImage is not present then it will be empty string
    //     dept,
    //     role
    // })



    //remove password and refresh token field from response

    if (role === 'student') {
        if (!year || !['1', '2', '3', '4'].includes(year)) {
            throw new ApiError(400, "year is required for students and must be between 1, 2, 3, 4")
        }
        const user = await User.create({
            fullName,
            email,
            username: username.toLowerCase(),
            password,
            avatar: avatar.url, //avatar image's url should be stored in a string format
            coverImage: coverImage?.url || "", //if  coverImage is not present then it will be empty string
            dept,
            role,
            year
        })
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while user registration")
        }

        //return response
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
    }
    else if (role === 'teacher') {
        const teacher = await Faculty.create({
            fullName,
            email,
            username: username.toLowerCase(),
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            dept,
            role
        });

        const createdTeacher = await Faculty.findById(teacher._id).select(
            "-password -refreshToken"
        );

        if (!createdTeacher) {
            throw new ApiError(500, "Something went wrong while teacher registration");
        }

        return res.status(201).json(
            new ApiResponse(200, createdTeacher, "Teacher registered successfully")
        );
    }
    else {
        throw new ApiError(400, "Invalid role specified");
    }

})

// const loginUser = asyncHandler(async (req, res) => {
//     // req body -> data
//     // username or email
//     //find the user
//     //password check
//     //access and referesh token
//     //send cookie

//     const { email, password, username, role } = req.body
//     console.log('Request body:', req.body);

//     if (!email && !username) {
//         throw new ApiError(400, "Username or email is required")
//     }
//     console.log(`Login attempt with email: ${email}, username: ${username}, role: ${role}`)
//     //if we have only one usermodel
//     // const user = await User.findOne({
//     //     $or: [{ email }, { username }]
//     // })

//     let user;
//     if (role === 'student') {
//         user = await User.findOne({
//             $or: [{ email }, { username }]
//         });
//     } else if (role === 'teacher') {
//         user = await Faculty.findOne({
//             $or: [{ email }, { username }]
//         });
//     }
//     if (!user) {
//         throw new ApiError(404, "User does not exist")
//     }
//     console.log(`User found: ${user}`);
//     console.log(`password : ${user.password}`);

//     // match password
//     const isPasswordValid = await user.isPasswordCorrect(password)
//     if (!isPasswordValid) {
//         throw new ApiError(401, "Invalid user credentials");
//     }
//     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id, role)

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     user: loggedInUser, accessToken, refreshToken
//                 },
//                 "User logged In Successfully"
//             )
//         )

// })

const loginUser = asyncHandler(async (req, res) => {
    //     // req body -> data
    //     // username or email
    //     //find the user
    //     //password check
    //     //access and referesh token
    //     //send cookie
    const { email, password, username, role } = req.body;
    // console.log('Request body:', req.body);

    if (!email && !username) {
        throw new ApiError(400, "Username or email is required");
    }

    //     //if we have only one usermodel
    //     // const user = await User.findOne({
    //     //     $or: [{ email }, { username }]
    //     // })

    let user;
    if (role === 'student') {
        user = await User.findOne({
            $or: [{ email }, { username }]
        });
    } else if (role === 'teacher') {
        user = await Faculty.findOne({
            $or: [{ email }, { username }]
        });
    }

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // console.log(`User found: ${user}`);
    // console.log(`password : ${user.password}`);

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id, role);

    const loggedInUser = role === 'student'
        ? await User.findById(user._id).select("-password -refreshToken")
        : await Faculty.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        ));
});

const logoutUser = asyncHandler(async (req, res) => {
    // only for one user
    // await User.findByIdAndUpdate(
    // req.user._id,
    // {
    //     $set: { refreshToken: undefined }
    // },
    // {
    //     new: true
    // }

    // )
    const user = req.user;

    if (user.role === 'student') {
        await User.findByIdAndUpdate(
            user._id,
            {
                $unset: { refreshToken: 1 }
            },
            {
                new: true
            }
        );
    } else if (user.role === 'teacher') {
        await Faculty.findByIdAndUpdate(
            user._id,
            {
                $unset: { refreshToken: 1 }
            },
            {
                new: true
            }
        );
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

// const logoutUser = asyncHandler(async (req, res) => {
//     const user = req.user;

//     // Update user or faculty based on role
//     if (user.role === 'student') {
//         await User.findByIdAndUpdate(
//             user._id,
//             { $unset: { refreshToken: 1 } },
//             { new: true }
//         );
//     } else if (user.role === 'teacher') {
//         await Faculty.findByIdAndUpdate(
//             user._id,
//             { $unset: { refreshToken: 1 } },
//             { new: true }
//         );
//     }

//     // Set cookie options
//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production' // Only set secure flag in production
//     };

//     return res
//         .status(200)
//         .clearCookie("accessToken", options)
//         .clearCookie("refreshToken", options)
//         .json(new ApiResponse(200, {}, "User logged out"));
// });

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request as token is not correct")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const { _id, role } = decodedToken;

        // const user = await User.findById(decodedToken?._id)
        // Fetch the user based on the role
        let user;
        if (role === 'student') {
            user = await User.findById(_id);
        } else if (role === 'teacher') {
            user = await Faculty.findById(_id);
        }

        if (!user) {
            throw new ApiError(401, "unauthorized request as token is not correct(Invalid refresh token)")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is invalid or used...")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // const user = await User.findById(req.user._id);
    // const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    const { _id, role } = req.user;

    let user;
    if (role === 'student') {
        user = await User.findById(_id);
    } else if (role === 'teacher') {
        user = await Faculty.findById(_id);
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // console.log("user :", req.user);
    return res
        .status(200)
        .json(200, req.user, "current user fetched sucessfully")
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, year } = req.body;
    if (!fullName || !email || !year) {
        throw new ApiError(400, "Please fill all the fields")
    }

    const { _id, role } = req.user;

    let user;
    if (role === 'student') {
        user = await User.findByIdAndUpdate(
            _id,
            {
                $set: {
                    fullName: fullName,
                    email: email,
                }
            },
            {
                new: true
            }
        ).select("-password");
    } else if (role === 'teacher') {
        user = await Faculty.findByIdAndUpdate(
            _id,
            {
                $set: {
                    fullName: fullName,
                    email: email,
                }
            },
            {
                new: true
            }
        ).select("-password");
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //for only one model
    // const user = await User.findByIdAndUpdate(
    //     req.user?._id,
    //     {
    //         $set: {
    //             fullName: fullName,
    //             email: email,
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const { _id, role } = req.user; //required as we need to separate for student and teacher
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, " error while uploading avatar")
    }
    // const user = await User.findByIdAndUpdate(
    //     req.user?._id,
    //     {
    //         $set: {
    //             avatar: avatar.url
    //         }
    //     },
    //     { new: true }
    // ).select("-password")

    let user;
    let oldUserAvatarUrl;

    if (role === 'student') {
        user = await User.findById(_id).select("-password");
    } else if (role === 'teacher') {
        user = await Faculty.findById(_id).select("-password");
    }

    oldUserAvatarUrl = user.avatar;

    if (role === 'student') {
        user = await User.findByIdAndUpdate(
            _id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            { new: true }
        ).select("-password");
    } else if (role === 'teacher') {
        user = await Faculty.findByIdAndUpdate(
            _id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            { new: true }
        ).select("-password");
    }

    // After successful update, delete the old image from Cloudinary
    if (oldUserAvatarUrl) {
        const publicId = oldUserAvatarUrl.split('/').pop().split('.')[0]; // Extract publicId from URL
        await deleteFromCloudinary(publicId);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const { _id, role } = req.user; //required as we need to separate for student and teacher
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "avatar is missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, " error while updating cover image")
    }

    let user;
    let oldCoverImageUrl;
    if (role === 'student') {
        user = await User.findById(_id).select("-password");
    } else if (role === 'teacher') {
        user = await Faculty.findById(_id).select("-password");
    }

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Store the current cover image URL before updating
    oldCoverImageUrl = user.coverImage;

    if (role === 'student') {
        user = await User.findByIdAndUpdate(
            _id,
            {
                $set: {
                    coverImage: coverImage.url
                }
            },
            { new: true }
        ).select("-password");
    } else if (role === 'teacher') {
        user = await Faculty.findByIdAndUpdate(
            _id,
            {
                $set: {
                    coverImage: coverImage.url
                }
            },
            { new: true }
        ).select("-password");
    }

    // After successful update, delete the old image from Cloudinary
    if (oldCoverImageUrl) {
        const publicId = oldCoverImageUrl.split('/').pop().split('.')[0]; // Extract publicId from URL
        await deleteFromCloudinary(publicId);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "cover image updated successfully")
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    let channel;
    let role;
    // Check if the username belongs to a user model(student)
    channel = await User.aggregate([
        {
            //Match: Finds documents where username matches the provided username.
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            //Lookups: Joins the subscriptions collection twice to get subscribers and subscribedTo information.
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            //Add Fields: Adds fields for subscribersCount, channelsSubscribedToCount, and isSubscribed.
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            //Project: Specifies the fields to include in the final output.
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);
    //now check condition
    if (channel.length) { ////If a channel is found in the User collection (channel.length is true), it sets the role to 'student'.
        role = 'student';
    } else {
        // If no user found, check in faculty
        channel = await Faculty.aggregate([
            {
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ]);
        role = 'teacher'; //If a channel is found in the Faculty collection, it sets the role to 'teacher'.
    }
    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const { _id, role } = req.user;
    let user;

    if (role === 'student') {
        user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: { //we are useing same name here as owner s that old owner can be overwrite
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ])
    } else if (role === 'teacher') {
        user = await Faculty.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: { //we are useing same name here as owner s that old owner can be overwrite
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ])
    }

    if (!user.length) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        );
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}