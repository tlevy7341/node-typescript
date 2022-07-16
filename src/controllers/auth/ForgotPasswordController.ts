import sgMail from "@sendgrid/mail";
import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { generateToken } from "../../utils/generateToken";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email }: { email: string } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    // Sending a 204 for security reasons
    if (!user) return res.sendStatus(204);

    const accessToken = await generateToken(
      user,
      process.env.PASSWORD_RESET_SECRET as string,
      "15m"
    );

    await prisma.passwordReset.create({
      data: {
        user_email: email,
        token: accessToken,
      },
    });

    const passwordResetURL = `${process.env.FRONTEND_URL}/reset-password?token=${accessToken}`;

    await sgMail.send({
      from: process.env.SENDER_FROM_EMAIL as string,
      to: email,
      subject: "Password Reset",
      text: `Please click the following link to reset your password: ${passwordResetURL}`,
      html: `<p>Please click the following link to reset your password: ${passwordResetURL}</p>`,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: {
        button_url: passwordResetURL,
      },
    });

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
};
