import validator from "validator";
import { Request, Response, NextFunction } from "express";

export const validateUsername = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ message: "username is required" });
    return;
  }

  const trimmedUsername = validator.trim(username);
  const isValidUsername = /^[a-zA-Z\s\-']+$/.test(trimmedUsername);

  if (!isValidUsername) {
    res.status(400).json({ message: "Invalid name format" });
    return;
  }

  req.body.validUsername = trimmedUsername;

  return next();
};
