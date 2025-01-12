import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createError } from "../utils/createError";

interface RequestInterface extends Request {
  user?: JwtPayload;
  cookies: { [key: string]: string };
}

export const verifyToken = (
  req: RequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.auth_token;
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey as string) as JwtPayload;

    if (!token) {
      return next(createError("Token is missing", 401));
    }

    req.user = decoded;

    next();
  } catch (error) {
    return next((error = createError("unauthorized token", 401)));
  }
};
