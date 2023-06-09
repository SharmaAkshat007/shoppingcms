import redis from "../redis/config";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import Error from "../types/error";
import UserRequest from "../interfaces/request.interface";
import dotenv from "dotenv";
import { Role } from "../enums";
dotenv.config();

export const verifyToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user_data = decoded as jwt.JwtPayload;
    req.token = token;

    const data: string = await redis.get("BL_" + req.user_data.id);

    if (data === token) {
      return next(new Error(400, "Blacklisted Token"));
    }
    next();
  } catch (err) {
    console.log(err);
    return next(new Error(401, "Your session is not valid"));
  }
};

export const verifyRefreshToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token;

  if (token === null) return next(new Error(401, "Invalid request"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user_data = decoded as jwt.JwtPayload;

    const data = await redis.get(req.user_data.id);

    if (data === null)
      return next(new Error(401, "Invalid request. Token is not in store."));
    // if (data !== token)
    //   return next(
    //     new Error(401, "Invalid request. Token is not same in store.")
    //   );

    next();
  } catch (error) {
    console.log("Refresh Error:", error.message);
    return next(new Error(401, "Your session is not valid"));
  }
};
