import pool from '../config/database';
import { Resource, CreateResourceDTO, UpdateResourceDTO, ResourceFilters } from '../types/resource.types';

export class ResourceModel {
  /**
   * Get all resources with optional filters
   */
  static async findAll(filters?: ResourceFilters): Promise<Resource[]> {
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.category) {
      query += ` AND category = $${paramCount++}`;
      params.push(filters.category);
    }

    if (filters?.minPrice !== undefined) {
      query += ` AND price >= $${paramCount++}`;
      params.push(filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND price <= $${paramCount++}`;
      params.push(filters.maxPrice);
    }

    if (filters?.minQuantity !== undefined) {
      query += ` AND quantity >= $${paramCount++}`;
      params.push(filters.minQuantity);
    }

    query += ' ORDER BY id DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find resource by ID
   */
  static async findById(id: number): Promise<Resource | null> {
    const result = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Create a new resource
   */
  static async create(data: CreateResourceDTO): Promise<Resource> {
    const query = `
      INSERT INTO resources (name, description, quantity, price, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.name,
      data.description || '',
      data.quantity,
      data.price,
      data.category,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a resource
   */
  static async update(id: number, data: UpdateResourceDTO): Promise<Resource | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${paramCount++}`);
      values.push(data.quantity);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(data.price);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(data.category);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE resources
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete a resource
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM resources WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Get statistics
   */
  static async getStats() {
    const countResult = await pool.query('SELECT COUNT(*) as count FROM resources');
    const categoriesResult = await pool.query('SELECT DISTINCT category FROM resources ORDER BY category');

    return {
      totalResources: parseInt(countResult.rows[0].count),
      categories: categoriesResult.rows,
    };
  }
}
