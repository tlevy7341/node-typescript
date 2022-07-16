import { Request, Response } from "express";
import { prisma } from "../../database/prisma";

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar, id }: { avatar: string; id: number } = req.body;
    await prisma.user.update({
      where: { id },
      data: { avatar },
    });

    res.sendStatus(200);
  } catch (e) {
    res.status(400).send("Unable to update avatar");
  }
};
