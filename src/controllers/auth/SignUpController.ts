import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { generateHashedPassword } from "../../utils/generateHashedPashword";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const hashedPassword = await generateHashedPassword(password);

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        refreshToken: "",
      },
    });

    res.sendStatus(201);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(409).send("There was a problem. Please try again later.");
      }
    } else {
      res.sendStatus(400);
    }
  }
};
