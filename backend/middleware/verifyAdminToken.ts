import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createError } from "../utils/createError";

interface RequestInterface extends Request {
  user?: JwtPayload;
  cookies: { [key: string]: string };
}

export const verifyAdminToken = (
  req: RequestInterface,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.auth_token;
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey as string) as JwtPayload;

    console.log(token);
    console.log(decoded);

    if (!token) {
      return next(createError("Token is missing", 401));
    }

    if (decoded.role !== "admin") {
      return next(createError("Not authorized as admin", 403));
    }

    req.user = decoded; // Store decoded data to request

    next();
  } catch (error) {
    return next(createError("Unauthorized token", 401));
  }
};
