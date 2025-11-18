import pool from "../config/database";
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserFilters,
} from "../types/user.types";

export class UserModel {
  /**
   * Get total count of users matching filters
   */
  static async count(filters?: UserFilters): Promise<number> {
    let query = "SELECT COUNT(*) as count FROM users WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    // Exclude soft-deleted users by default
    if (!filters?.includeDeleted) {
      query += " AND deleted_at IS NULL";
    }

    if (filters?.role) {
      query += ` AND role = $${paramCount++}`;
      params.push(filters.role);
    }

    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters?.minAge !== undefined) {
      query += ` AND age >= $${paramCount++}`;
      params.push(filters.minAge);
    }

    if (filters?.maxAge !== undefined) {
      query += ` AND age <= $${paramCount++}`;
      params.push(filters.maxAge);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }

  /**
   * Get all users with optional filters and pagination
   */
  static async findAll(filters?: UserFilters): Promise<User[]> {
    let query = "SELECT * FROM users WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    // Exclude soft-deleted users by default
    if (!filters?.includeDeleted) {
      query += " AND deleted_at IS NULL";
    }

    if (filters?.role) {
      query += ` AND role = $${paramCount++}`;
      params.push(filters.role);
    }

    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters?.minAge !== undefined) {
      query += ` AND age >= $${paramCount++}`;
      params.push(filters.minAge);
    }

    if (filters?.maxAge !== undefined) {
      query += ` AND age <= $${paramCount++}`;
      params.push(filters.maxAge);
    }

    // Add sorting
    const sortBy = filters?.sortBy || "id";
    const sortOrder = filters?.sortOrder || "DESC";
    const allowedSortColumns = [
      "id",
      "name",
      "email",
      "age",
      "role",
      "created_at",
      "updated_at",
    ];

    if (allowedSortColumns.includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      query += " ORDER BY id DESC";
    }

    // Add pagination
    if (filters?.limit !== undefined && filters?.page !== undefined) {
      const limit = filters.limit;
      const offset = (filters.page - 1) * limit;
      query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      params.push(limit, offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find user by ID (excludes soft-deleted by default)
   */
  static async findById(
    id: number,
    includeDeleted = false
  ): Promise<User | null> {
    let query = "SELECT * FROM users WHERE id = $1";
    if (!includeDeleted) {
      query += " AND deleted_at IS NULL";
    }
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find user by email (excludes soft-deleted by default)
   */
  static async findByEmail(
    email: string,
    includeDeleted = false
  ): Promise<User | null> {
    let query = "SELECT * FROM users WHERE email = $1";
    if (!includeDeleted) {
      query += " AND deleted_at IS NULL";
    }
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Create a new user
   */
  static async create(data: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO users (name, email, age, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.name,
      data.email,
      data.age || null,
      data.role,
      data.status || "active",
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a user
   */
  static async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.age !== undefined) {
      fields.push(`age = $${paramCount++}`);
      values.push(data.age);
    }
    if (data.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(data.role);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Soft delete a user (sets deleted_at timestamp)
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Restore a soft-deleted user
   */
  static async restore(id: number): Promise<User | null> {
    const result = await pool.query(
      "UPDATE users SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Permanently delete a user (hard delete)
   */
  static async hardDelete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Get statistics (excludes soft-deleted users by default)
   */
  static async getStats() {
    const countResult = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL"
    );
    const rolesResult = await pool.query(
      "SELECT DISTINCT role FROM users WHERE deleted_at IS NULL ORDER BY role"
    );
    const statusResult = await pool.query(
      "SELECT status, COUNT(*) as count FROM users WHERE deleted_at IS NULL GROUP BY status"
    );

    return {
      totalUsers: parseInt(countResult.rows[0].count),
      roles: rolesResult.rows,
      statusBreakdown: statusResult.rows,
    };
  }
}
