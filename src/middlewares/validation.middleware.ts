import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.errors.map((e) => e.message),
        });
      }
      next(err);
    }
  };
};
