import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { generateHashedPassword } from "../../utils/generateHashedPashword";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { authToken, password }: { authToken: string; password: string } =
      req.body;

    const user = await prisma.passwordReset.findUnique({
      where: { token: authToken },
    });
    if (!user)
      return res
        .status(403)
        .send("Something went wrong. Please try again later.");

    const newPassword = await generateHashedPassword(password);

    await prisma.user.update({
      where: { email: user.user_email },
      data: { password: newPassword },
    });

    await prisma.passwordReset.delete({ where: { token: authToken } });

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
};
