import { NextFunction, Request, Response } from "express";
import { Secret, verify } from "jsonwebtoken";

export const validateToken = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader: string = req.headers.authorization;
    const token: string = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).send({ error: "You are not authorized." });

    verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      (err, user: any) => {
        if (err) {
          res.clearCookie("token");
          return res.status(403).send({ error: "Token is invalid." });
        }
        req.user = user;
        next();
      }
    );
  } catch (e) {
    res.status(400).send({ error: e });
  }
};
