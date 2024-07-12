import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Faculty } from "../models/faculty.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //we used ._id because in usermodel also we have assigned this while jwt config
        // Determine if the user is a student or a teacher based on the token payload
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") ||
            await Faculty.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})