import bcrypt from "bcryptjs";

type HashedCredentials = {
  hashedPassword: string;
};

export const hashPassword = async (
  password: string
): Promise<HashedCredentials> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return { hashedPassword };
};
