import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { cookieOptions } from "../../utils/cookieOptions";

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    console.log("here");
    const { id }: { id: number } = req.body;
    await prisma.user.delete({ where: { id } });
    res.clearCookie("access_token", { ...cookieOptions });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send("Something went wrong. Please try again later.");
  }
};
