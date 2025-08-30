import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function verifyUserAuthorization(requiredRoles: string[]) {
  return function (request: Request, response: Response, next: NextFunction) {
    const user = request.user;

    if (!user) {
      throw new AppError("User not authenticated", 401);
    }

    const hasRequiredRole = user.role.some((userRole) =>
      requiredRoles.includes(userRole)
    );

    if (!hasRequiredRole) {
      throw new AppError("User does not have permission", 403);
    }

    return next();
  };
}

export { verifyUserAuthorization };
