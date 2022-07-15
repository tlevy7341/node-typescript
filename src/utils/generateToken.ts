import jwt from "jsonwebtoken";

export const generateToken = async (
  user: { id: number; email: string },
  secret: string,
  expiresIn: string
) => {
  return await jwt.sign(user, secret, {
    expiresIn: expiresIn,
  });
};
