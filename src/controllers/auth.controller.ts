import { Prisma } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { prisma } from "../database/prisma";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

type AuthType = {
  email: string;
  password: string;
};

type UserType = {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
};

const generateHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const generateToken = async (
  user: UserType,
  secret: Secret,
  expiresIn: string
) => {
  return await jwt.sign({ user }, secret, {
    expiresIn: expiresIn,
  });
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password }: AuthType = req.body;
    const hashedPassword = await generateHashedPassword(password);

    const user: UserType = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    const token = await generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      "8h"
    );
    res.cookie("token", token, { httpOnly: true });

    res.status(201).send({ user });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res
          .status(400)
          .send({ error: "Email already exists. Please sign in." });
      }
    } else {
      res.status(400).send({ error: e });
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password }: AuthType = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .send({ error: "Email not found. Please Sign Up." });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).send({ error: "Password is incorrect." });
    }

    const token = await generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      "8h"
    );
    res.cookie("token", token, { httpOnly: true });

    res.status(200).send({ user });
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.cookie("token", "", { httpOnly: true, maxAge: 1 });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).send({ error: "Email not found." });
    const randomString = Math.random().toString(20).substr(2, 12);
    const passwordResetSeecret =
      process.env.PASSWORD_RESET_SECRET + randomString;
    const token = await generateToken(user, passwordResetSeecret, "15m");
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: token,
      },
    });
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sgMail.send({
      from: process.env.SENDER_FROM_EMAIL as string,
      to: email,
      subject: "Password Reset",
      text: `Please click the following link to reset your password: ${url}`,
      html: `<p>Please click the following link to reset your password: ${url}</p>`,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: {
        button_url: url,
      },
    });
    res
      .status(200)
      .send({ message: "Check your email for the password reset link." });
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await prisma.passwordReset.findUnique({
      where: { token },
    });
    if (!user) return res.status(404).send({ error: "User is not found" });
    const newPassword = await generateHashedPassword(req.body.password);
    await prisma.user.update({
      where: { email: user.email },
      data: { password: newPassword },
    });

    await prisma.passwordReset.delete({ where: { token } });

    res.status(200).send({ message: "Password has been reset." });
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id }: { id: number } = req.body;
    await prisma.user.delete({ where: { id } });
    res.status(200).send({ message: "Account deleted" });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        res
          .status(400)
          .send({ error: "Unable to delete account. Please try again later." });
      }
    } else {
      res.status(400).send({ error: e });
    }
  }
};
