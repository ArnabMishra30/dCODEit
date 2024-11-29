// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { Faculty } from "../models/faculty.model.js";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
//         if (!token) {
//             throw new ApiError(401, "unauthorized request")
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//         //we used ._id because in usermodel also we have assigned this while jwt config
//         // Determine if the user is a student or a teacher based on the token payload
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken") ||
//             await Faculty.findById(decodedToken?._id).select("-password -refreshToken");

//         if (!user) {
//             throw new ApiError(401, "Invalid Access Token")
//         }

//         req.user = user;
//         next()
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
// })


//the difference between below and above code is in above code the decoded token is not handeld in a try catch block................

import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { Faculty } from "../models/faculty.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            console.log("Token not found");
            return next(new ApiError(401, "Unauthorized request"));
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            console.log("Error verifying token:", err.message);
            return next(new ApiError(401, "Invalid access token"));
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken") ||
            await Faculty.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            console.log("User not found for token");
            return next(new ApiError(401, "Invalid access token"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Middleware error:", error.message);
        return next(new ApiError(401, error.message || "Invalid access token"));
    }
});
