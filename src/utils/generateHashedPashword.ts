import bcrypt from "bcrypt";

export const generateHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
