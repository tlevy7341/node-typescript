import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { cookieOptions } from "../../utils/cookieOptions";

export const signOut = async (req: Request, res: Response) => {
  try {
    const accessToken: string = req.cookies.access_token;
    if (!accessToken) return res.sendStatus(204);

    const user = await prisma.user.findFirst({
      where: { refreshToken: accessToken },
    });

    if (!user) {
      res.clearCookie("access_token", {
        ...cookieOptions,
      });
      return res.status(204);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: "" },
    });

    res.clearCookie("access_token", {
      ...cookieOptions,
    });

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
};
