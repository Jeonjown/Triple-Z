import { Request, Response, NextFunction } from "express";

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { password } = req.body;

  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required.");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(" ") });
    return;
  }

  req.body.validPassword = password;

  return next();
};
