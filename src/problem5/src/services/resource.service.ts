import { ResourceModel } from '../models/resource.model';
import { CreateResourceDTO, UpdateResourceDTO, ResourceFilters, Resource } from '../types/resource.types';

export class ResourceService {
  /**
   * Get all resources with optional filters
   */
  static async getAllResources(filters?: ResourceFilters): Promise<Resource[]> {
    return await ResourceModel.findAll(filters);
  }

  /**
   * Get resource by ID
   */
  static async getResourceById(id: number): Promise<Resource | null> {
    return await ResourceModel.findById(id);
  }

  /**
   * Create a new resource
   */
  static async createResource(data: CreateResourceDTO): Promise<Resource> {
    // Additional business logic can be added here
    this.validateCreateData(data);
    return await ResourceModel.create(data);
  }

  /**
   * Update a resource
   */
  static async updateResource(id: number, data: UpdateResourceDTO): Promise<Resource | null> {
    const existing = await ResourceModel.findById(id);
    if (!existing) {
      return null;
    }
    return await ResourceModel.update(id, data);
  }

  /**
   * Delete a resource
   */
  static async deleteResource(id: number): Promise<boolean> {
    return await ResourceModel.delete(id);
  }

  /**
   * Get statistics
   */
  static async getStats() {
    return await ResourceModel.getStats();
  }

  /**
   * Validate create data
   */
  private static validateCreateData(data: CreateResourceDTO): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (data.quantity < 0) {
      throw new Error('Quantity must be non-negative');
    }
    if (data.price < 0) {
      throw new Error('Price must be non-negative');
    }
    if (!data.category || data.category.trim().length === 0) {
      throw new Error('Category is required');
    }
  }
}
