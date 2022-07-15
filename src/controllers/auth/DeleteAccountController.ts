import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { cookieOptions } from "../../utils/cookieOptions";

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.body;
    await prisma.user.delete({ where: { id } });
    res.clearCookie("access_token", { ...cookieOptions });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
};
