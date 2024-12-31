import { Request, Response } from "express";
import User from "../models/userModel";
import { hashPassword } from "../utils/hashPassword";
import { comparePasswords } from "../utils/comparePasswords";
import { generateToken } from "../utils/generateToken";

// JWT AUTH
export const jwtSignup = async (req: Request, res: Response): Promise<void> => {
  const { validUsername, validEmail, validPassword, confirmPassword } =
    req.body;

  try {
    // Check if username is already taken
    const foundUser = await User.findOne({ username: validUsername });
    if (foundUser) {
      res
        .status(400)
        .json({ message: "Username already taken. Please use another." });
      return; // Prevent further execution if username is already taken
    }

    // Check if email is already taken
    const foundEmail = await User.findOne({ email: validEmail });
    if (foundEmail) {
      res
        .status(400)
        .json({ message: "Email already taken. Please use another." });
      return; // Prevent further execution if email is already taken
    }

    // Hash password
    const { hashedPassword } = await hashPassword(validPassword);

    // Compare password and confirm password
    const isMatch = await comparePasswords(confirmPassword, hashedPassword);
    if (!isMatch) {
      res.status(400).json({ message: "Password does not match!" });
      return; // Return if passwords don't match
    }

    // Create new user
    const newUser = new User({
      username: validUsername,
      email: validEmail,
      password: hashedPassword,
      role: "user", // Default role
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = generateToken(
      newUser._id.toString(),
      newUser.username,
      newUser.role
    );

    // give cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: 259200000,
    });

    // Respond with success message and token
    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (error: any) {
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      res.status(400).json({ message: "Username or email already exists" });
      return; // Prevent further execution
    }

    // Handle other errors
    console.log(error);
    const errorMessage = (error as Error).message || "Internal Server Error";
    res.status(500).json({
      message: "Internal server error",
      error: errorMessage,
    });
  }
};

export const jwtLogin = async (req: Request, res: Response) => {};

// Google Auth
