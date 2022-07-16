import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { cookieOptions } from "../../utils/cookieOptions";
import { generateToken } from "../../utils/generateToken";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return res.status(401).send("Invalid email or password");

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      return res.status(401).send("Invalid email or password");

    //Extracting password and createdAt from user object so that I don't send it to the client
    const { password: _, createdAt: __, refreshToken: ___, ...userData } = user;

    const accessToken = await generateToken(
      userData,
      process.env.ACCESS_TOKEN_SECRET as string,
      "10s"
    );

    const refreshToken = await generateToken(
      userData,
      process.env.REFRESH_TOKEN_SECRET as string,
      "1d"
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("access_token", refreshToken, { ...cookieOptions });
    res.status(200).send({ userData, accessToken });
  } catch (e) {
    res.sendStatus(400);
  }
};
