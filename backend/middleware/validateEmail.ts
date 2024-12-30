import { Request, Response, NextFunction } from "express";
import validator from "validator";

export const validateEmail = (req: Request, res: Response, next: Function) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  req.body.validEmail = email;

  return next();
};
