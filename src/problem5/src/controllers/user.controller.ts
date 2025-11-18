import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO, UserFilters } from "../types/user.types";

export class UserController {
  /**
   * Get all users with pagination support
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: UserFilters = {};

      if (req.query.role) {
        filters.role = req.query.role as string;
      }
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      if (req.query.minAge) {
        filters.minAge = parseInt(req.query.minAge as string);
      }
      if (req.query.maxAge) {
        filters.maxAge = parseInt(req.query.maxAge as string);
      }
      if (req.query.includeDeleted === "true") {
        filters.includeDeleted = true;
      }
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy as
          | "id"
          | "name"
          | "email"
          | "age"
          | "role"
          | "created_at"
          | "updated_at";
      }
      if (req.query.sortOrder) {
        filters.sortOrder = req.query.sortOrder as "ASC" | "DESC";
      }
      if (req.query.page) {
        filters.page = parseInt(req.query.page as string);
      }
      if (req.query.limit) {
        filters.limit = parseInt(req.query.limit as string);
      }

      const result = await UserService.getAllUsers(filters);

      // If pagination is used, result is PaginatedResponse
      if ("pagination" in result) {
        res.json(result);
      } else {
        // Otherwise, return simple array response
        res.json({
          success: true,
          count: result.length,
          filters: Object.keys(filters).length > 0 ? filters : null,
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get single user by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID format",
        });
        return;
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Create new user
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, age, role, status }: CreateUserDTO = req.body;

      // Validation
      if (!name || typeof name !== "string") {
        res.status(400).json({
          success: false,
          error: "Name is required and must be a string",
        });
        return;
      }

      if (!email || typeof email !== "string") {
        res.status(400).json({
          success: false,
          error: "Email is required and must be a string",
        });
        return;
      }

      if (
        age !== undefined &&
        (typeof age !== "number" || age < 0 || age > 150)
      ) {
        res.status(400).json({
          success: false,
          error: "Age must be a number between 0 and 150",
        });
        return;
      }

      if (!role || typeof role !== "string") {
        res.status(400).json({
          success: false,
          error: "Role is required and must be a string",
        });
        return;
      }

      const newUser = await UserService.createUser({
        name,
        email,
        age,
        role,
        status,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email already exists") {
        res.status(409).json({
          success: false,
          error: "Email already exists",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Update user (PUT - full update)
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID format",
        });
        return;
      }

      const { name, email, age, role, status } = req.body;

      // For PUT, all fields are required
      if (!name || !email || !role) {
        res.status(400).json({
          success: false,
          error: "PUT requires all fields: name, email, role",
        });
        return;
      }

      const updatedUser = await UserService.updateUser(id, {
        name,
        email,
        age,
        role,
        status,
      });

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email already exists") {
        res.status(409).json({
          success: false,
          error: "Email already exists",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to update user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Partial update (PATCH)
   */
  static async partialUpdate(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID format",
        });
        return;
      }

      const updates: UpdateUserDTO = {};

      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.email !== undefined) updates.email = req.body.email;
      if (req.body.age !== undefined) updates.age = req.body.age;
      if (req.body.role !== undefined) updates.role = req.body.role;
      if (req.body.status !== undefined) updates.status = req.body.status;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          error: "No valid fields to update",
        });
        return;
      }

      const updatedUser = await UserService.updateUser(id, updates);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email already exists") {
        res.status(409).json({
          success: false,
          error: "Email already exists",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to update user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Delete user (soft delete)
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID format",
        });
        return;
      }

      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "User not found or already deleted",
        });
        return;
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to delete user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Restore a soft-deleted user
   */
  static async restore(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid ID format",
        });
        return;
      }

      const restoredUser = await UserService.restoreUser(id);

      if (!restoredUser) {
        res.status(404).json({
          success: false,
          error: "User not found or not deleted",
        });
        return;
      }

      res.json({
        success: true,
        message: "User restored successfully",
        data: restoredUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to restore user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get statistics
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await UserService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
