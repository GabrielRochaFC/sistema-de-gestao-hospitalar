import { Request, Response } from "express";
import {
  getAllUsers,
  getAllUsersWithInactive,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "@/services/user-service";
import { getUserSchema, updateUserSchema, updateUserStatusSchema } from "@/schemas/user-schemas";
import { paginationSchema } from "@/schemas/pagination-schemas";

export class UserController {
  async getAuthUser(req: Request, res: Response) {
    const userId = req.user?.id;
    const id = getUserSchema.parse(userId);
    const response = await getUserById(id);
    return res.status(200).json(response);
  }

  async getUserById(req: Request, res: Response) {
    const id = getUserSchema.parse(req.params.id);
    const response = await getUserById(id);
    return res.status(200).json(response);
  }

  async getAllUsers(req: Request, res: Response) {
    const paginationData = paginationSchema.parse(req.query);
    const response = await getAllUsers(paginationData);
    return res.status(200).json(response);
  }

  async getAllUsersWithInactive(req: Request, res: Response) {
    const paginationData = paginationSchema.parse(req.query);
    const response = await getAllUsersWithInactive(paginationData);
    return res.status(200).json(response);
  }

  async updateUser(req: Request, res: Response) {
    const id = getUserSchema.parse(req.params.id);
    const data = updateUserSchema.parse(req.body);
    const response = await updateUser(id, data);
    return res.status(200).json(response);
  }

  async updateOwnProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    const id = getUserSchema.parse(userId);
    const data = updateUserSchema.parse(req.body);
    const response = await updateUser(id, data);
    return res.status(200).json(response);
  }

  async updateUserStatus(req: Request, res: Response) {
    const id = getUserSchema.parse(req.params.id);
    const data = updateUserStatusSchema.parse(req.body);
    const response = await updateUserStatus(id, data);
    return res.status(200).json(response);
  }

  async deleteUser(req: Request, res: Response) {
    const id = getUserSchema.parse(req.params.id);
    const response = await deleteUser(id);
    return res.status(204).json();
  }
}
