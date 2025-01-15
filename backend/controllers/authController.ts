import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import { hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { createError } from "../utils/createError";

interface RequestInterface extends Request {
  user?: JwtPayload;
  cookies: { [key: string]: string };
}

// JWT AUTH
export const jwtSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { validUsername, validEmail, validPassword, confirmPassword } =
    req.body;

  try {
    // Ensure no fields are empty
    if (!validUsername || !validEmail || !validPassword || !confirmPassword) {
      return next(createError("Fields cannot be empty.", 400));
    }

    // Check if username is already taken
    const foundUser = await User.findOne({ username: validUsername });
    if (foundUser) {
      return next(
        createError("Username already taken. Please use another.", 400)
      );
    }

    // Check if email is already taken
    const foundEmail = await User.findOne({ email: validEmail });
    if (foundEmail) {
      return next(createError("Email already taken. Please use another.", 400));
    }

    // Ensure password and confirm password match
    if (validPassword !== confirmPassword) {
      return next(createError("Passwords do not match!", 400));
    }

    // Hash password
    const { hashedPassword } = await hashPassword(validPassword);

    // Create new user
    const newUser = new User({
      username: validUsername,
      email: validEmail,
      password: hashedPassword,
      role: "user", // Default role
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = generateToken(
      newUser._id.toString(),
      newUser.username,
      newUser.role
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 259200000,
    });

    // Respond with success
    res.json({
      message: "User created successfully",
      user: { id: newUser._id, username: newUser.username, role: newUser.role },
      token,
    });
  } catch (error: any) {
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      return next(createError("Username or email already exists", 400));
    }

    // Handle other errors
    return next(createError("Internal server error", 500));
  }
};

export const jwtLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email) {
    return next(createError("Email is needed.", 400));
  }

  if (!password) {
    return next(createError("Password is needed.", 400));
  }

  try {
    // Check if user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError("User not found.", 404));
    }

    // Generate a JWT token
    const token = generateToken(user._id.toString(), user.username, user.role);

    // Set the token as a cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 259200000,
    });

    // Send the token in the response
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    // Handle unexpected errors
    return next(createError("Internal server error.", 500));
  }
};

export const checkAuth = (
  req: RequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    console.log(user);
    res.status(200).json({ user });
    return;
  } catch (error) {
    return next(createError("Internal Server Error", 500));
  }
};

export const logoutUser = async (
  req: RequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the cookie exists
    if (!req.cookies.auth_token) {
      return next(createError("No Valid Cookie", 400)); // Throw error if no cookie found
    }

    // Clear the cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    // Send success message
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return next(createError("Internal Server Error", 500)); // Pass the error to the error handler
  }
};
