import bcrypt from "bcryptjs";
import { createError } from "./createError";

export const comparePasswords = async (
  confirmPassword: string | undefined,
  validPassword: string | undefined
): Promise<boolean> => {
  if (!confirmPassword || !validPassword) {
    throw createError("Passwords cannot be empty", 400);
  }

  try {
    // Await the bcrypt comparison
    const isMatch = await bcrypt.compare(confirmPassword, validPassword);
    return isMatch;
  } catch (error) {
    throw createError("Error comparing passwords", 500);
  }
};
