import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function verifyUserAuthorization(role: string[]) {
  return function (request: Request, response: Response, next: NextFunction) {
    const user = request.user;

    if (!user) {
      throw new AppError("User not authenticated", 401);
    }

    if (!role.includes(user.role)) {
      throw new AppError("User does not have permission", 403);
    }

    return next();
  };
}

export { verifyUserAuthorization };
