import passport from "passport";
import { generateToken } from "../utils/generateToken";
import { createError } from "../utils/createError";
import User from "../models/userModel"; // This is the model
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (
      request: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: Function
    ) {
      const { id, displayName, emails } = profile;
      const email = emails[0].value;

      try {
        // Use `User.findOne` to check if the user already exists in the database
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          // Create a new user if not found
          existingUser = new User({
            id,
            username: displayName,
            role: "user",
            email,
            password: undefined,
          });

          // Save the new user to the database
          await existingUser.save();
        }

        // Create the payload for JWT token
        const payload = {
          id: existingUser.id,
          username: existingUser.username, // Use the username from the existing user
          role: existingUser.role,
        };

        // Generate the JWT token
        const token = generateToken(payload.id, payload.username, payload.role);

        // Return the user and token to passport's `done` callback
        return done(null, { user: existingUser, token });
      } catch (error) {
        // Handle any errors that occur during user creation or retrieval
        console.error("Error during authentication:", error);
        return done(createError("authentication error", 400), null);
      }
    }
  )
);

export default passport;
