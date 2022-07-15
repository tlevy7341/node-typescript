import { NextFunction, Request, Response } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";

export const validateToken = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader: string =
      req.headers.Authorization || req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err: VerifyErrors | null, decoded: any) => {
        if (err) return res.sendStatus(403);

        req.user = decoded;

        next();
      }
    );
  } catch (e) {
    res.sendStatus(400);
  }
};
