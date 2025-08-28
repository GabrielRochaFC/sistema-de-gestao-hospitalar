import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const errorHandling = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: z.treeifyError(err),
    });
  }

  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};
