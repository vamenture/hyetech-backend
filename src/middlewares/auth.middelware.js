import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = 
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.header("token");



    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken?._id).select("-password -token");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in JWT verification:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

