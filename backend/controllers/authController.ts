import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import { hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { createError } from "../utils/createError";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"; // Import nodemailer
import crypto from "crypto"; // Import crypto

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

    if (!newUser._id) {
      throw new Error("User ID is missing.");
    }

    // Generate JWT token
    const token = generateToken(
      newUser._id.toString(),
      newUser.username,
      newUser.role
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

    const isPasswordMatch =
      user.password && (await bcrypt.compare(password, user.password));

    if (!isPasswordMatch) {
      return next(createError("Password does not match.", 400));
    }

    // Generate a JWT token
    const token = generateToken(user.id.toString(), user.username, user.role);

    // Set the token as a cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 259200000,
    });

    // Send the token in the response
    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, username: user.username, role: user.role },
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

// Configure Nodemailer (replace with your email service details)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.BUSINESS_EMAIL_PASS,
  },
});

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({
        message:
          "If an account with this email exists, we've sent a password reset link.",
      });
      return;
    }

    // Check if there's an existing, unexpired password reset token
    const existingRequest = await User.findOne({
      email: user.email,
      passwordResetToken: { $ne: null },
      passwordResetExpires: { $gt: new Date() },
    });

    if (existingRequest) {
      res.status(200).json({
        message:
          "A password reset request is already in progress for this email address. Please check your inbox or try again later.",
      });
      return;
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiration (e.g., 1 hour)
    const passwordResetExpires = Date.now() + 3600000;

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = new Date(passwordResetExpires); // Use 'new Date()'
    await user.save();

    // Create reset link
    const resetLink = `${req.headers.origin}/reset-password?token=${resetToken}&email=${email}`; // Adjust the URL as needed

    // Send email
    const mailOptions = {
      to: email,
      from: `"Triple-Z" <${process.env.BUSINESS_EMAIL}>`,
      subject: "Password Reset Request",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request - Triple-Z</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #000000; /* Changed to black */
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .link-container {
            text-align: center;
            margin-top: 25px;
        }
        .reset-link {
            display: inline-block;
            background-color: transparent; /* Make the background transparent */
            color: #7B4D35; /* Brown text */
            border: 2px solid #7B4D35; /* Add a brown border */
            padding: 10px 23px; /* Adjust padding slightly */
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .reset-link:hover {
            background-color: #f2f2f2; /* Light gray background on hover for feedback */
            color: #7B4D35; /* Keep the text brown on hover */
        }
        .disclaimer {
            font-size: 0.8em;
            color: #777;
            margin-top: 30px;
            text-align: center;
        }
        .company-name {
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your <span class="company-name">Triple-Z</span> account.</p>
        <div class="link-container">
            <a href="${resetLink}" class="reset-link" style="text-decoration: none;">Click here to reset your password</a>
        </div>
        <p>If the button above doesn't work, you can also paste the following link into your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>Thank you,<br>The <span class="company-name">Triple-Z</span> Team</p>
        <div class="disclaimer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} <span class="company-name">Triple-Z</span>. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "If an account with this email exists, we've sent a password reset link.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, email, password } = req.body;

    // Hash the token from the URL
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() }, // Compare with a Date object
      email,
    });

    if (!user) {
      return next(createError("Invalid or expired reset token.", 400));
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Your password has been successfully reset." });
  } catch (error) {
    next(error);
  }
};
