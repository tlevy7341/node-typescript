import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateInput =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).send({ errors: e.flatten().fieldErrors });
      } else {
        res.sendStatus(400);
      }
    }
  };
