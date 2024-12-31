import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}
const secretKey = process.env.JWT_SECRET;

export const generateToken = (id: string, username: string, role: string) => {
  const payload = {
    id,
    username,
    role,
  };

  const options = {
    expiresIn: "7d",
    issuer: "yourAppName",
  };

  const token = jwt.sign(payload, secretKey, options);

  return token;
};
