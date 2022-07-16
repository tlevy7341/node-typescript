import { Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { prisma } from "../../database/prisma";
import { cookieOptions } from "../../utils/cookieOptions";
import { generateToken } from "../../utils/generateToken";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const accessToken: string = req.cookies.access_token;
    if (!accessToken) return res.sendStatus(401);

    const user = await prisma.user.findFirst({
      where: {
        refreshToken: accessToken,
      },
    });

    if (!user) return res.sendStatus(403);

    //Extracting password and createdAt from user object so that I don't send it to the client
    const { password: _, createdAt: __, refreshToken: ___, ...userData } = user;

    jwt.verify(
      accessToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err || decoded.id !== userData.id) return res.sendStatus(403);

        const newAccessToken = await generateToken(
          userData,
          process.env.ACCESS_TOKEN_SECRET as string,
          "10s"
        );

        const newRefreshToken = await generateToken(
          userData,
          process.env.REFRESH_TOKEN_SECRET as string,
          "1d"
        );

        await prisma.user.update({
          where: { id: decoded.id },
          data: { refreshToken: newRefreshToken },
        });

        res.cookie("access_token", newRefreshToken, { ...cookieOptions });
        res.status(200).send({ newAccessToken, userData });
      }
    );
  } catch (e) {
    res.sendStatus(400);
  }
};
