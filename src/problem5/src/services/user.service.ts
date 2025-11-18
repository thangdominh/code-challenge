import { UserModel } from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO, UserFilters, User, PaginatedResponse, PaginationMeta } from '../types/user.types';

export class UserService {
  /**
   * Get all users with optional filters and pagination
   */
  static async getAllUsers(filters?: UserFilters): Promise<User[] | PaginatedResponse<User>> {
    // If pagination parameters are provided, return paginated response
    if (filters?.page !== undefined && filters?.limit !== undefined) {
      const page = Math.max(1, filters.page); // Ensure page is at least 1
      const limit = Math.max(1, Math.min(100, filters.limit)); // Limit between 1-100

      // Update filters with sanitized values
      const sanitizedFilters = { ...filters, page, limit };

      // Get total count and users in parallel
      const [totalCount, users] = await Promise.all([
        UserModel.count(sanitizedFilters),
        UserModel.findAll(sanitizedFilters)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const pagination: PaginationMeta = {
        currentPage: page,
        pageSize: limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      };

      // Remove pagination params from filters object for response
      const { page: _, limit: __, ...responseFilters } = sanitizedFilters;

      return {
        success: true,
        data: users,
        pagination,
        filters: Object.keys(responseFilters).length > 0 ? responseFilters : undefined
      };
    }

    // If no pagination, return all users as array
    return await UserModel.findAll(filters);
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: number): Promise<User | null> {
    return await UserModel.findById(id);
  }

  /**
   * Create a new user
   */
  static async createUser(data: CreateUserDTO): Promise<User> {
    // Additional business logic can be added here
    this.validateCreateData(data);

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    return await UserModel.create(data);
  }

  /**
   * Update a user
   */
  static async updateUser(id: number, data: UpdateUserDTO): Promise<User | null> {
    const existing = await UserModel.findById(id);
    if (!existing) {
      return null;
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== existing.email) {
      const emailExists = await UserModel.findByEmail(data.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    return await UserModel.update(id, data);
  }

  /**
   * Delete a user (soft delete)
   */
  static async deleteUser(id: number): Promise<boolean> {
    return await UserModel.delete(id);
  }

  /**
   * Restore a soft-deleted user
   */
  static async restoreUser(id: number): Promise<User | null> {
    return await UserModel.restore(id);
  }

  /**
   * Permanently delete a user (hard delete)
   */
  static async hardDeleteUser(id: number): Promise<boolean> {
    return await UserModel.hardDelete(id);
  }

  /**
   * Get statistics
   */
  static async getStats() {
    return await UserModel.getStats();
  }

  /**
   * Validate create data
   */
  private static validateCreateData(data: CreateUserDTO): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!data.email || data.email.trim().length === 0) {
      throw new Error('Email is required');
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
    if (data.age !== undefined && (data.age < 0 || data.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }
    if (!data.role || data.role.trim().length === 0) {
      throw new Error('Role is required');
    }
  }
}
