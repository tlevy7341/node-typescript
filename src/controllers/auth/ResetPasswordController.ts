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
    if (!user) return res.sendStatus(403);

    const newPassword = await generateHashedPassword(password);

    await prisma.user.update({
      where: { email: user.user_email },
      data: { password: newPassword },
    });

    await prisma.passwordReset.delete({ where: { token: authToken } });

    res.status(200).send({ message: "Password has been reset." });
  } catch (e) {
    res.status(400).send({ error: e });
  }
};
