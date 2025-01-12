import bcrypt from "bcryptjs";
import { createError } from "./createError";
export const comparePassword = () => {};

export const comparePasswords = async (
  confirmPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(confirmPassword, hashedPassword);

  return isMatch;
};
