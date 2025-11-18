import { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { CreateResourceDTO, UpdateResourceDTO, ResourceFilters } from '../types/resource.types';

export class ResourceController {
  /**
   * Get all resources
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: ResourceFilters = {};

      if (req.query.category) {
        filters.category = req.query.category as string;
      }
      if (req.query.minPrice) {
        filters.minPrice = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        filters.maxPrice = parseFloat(req.query.maxPrice as string);
      }
      if (req.query.minQuantity) {
        filters.minQuantity = parseInt(req.query.minQuantity as string);
      }

      const resources = await ResourceService.getAllResources(filters);

      res.json({
        success: true,
        count: resources.length,
        filters: Object.keys(filters).length > 0 ? filters : null,
        data: resources,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resources',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get single resource by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format',
        });
        return;
      }

      const resource = await ResourceService.getResourceById(id);

      if (!resource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        data: resource,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch resource',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Create new resource
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, quantity, price, category }: CreateResourceDTO = req.body;

      // Validation
      if (!name || typeof name !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Name is required and must be a string',
        });
        return;
      }

      if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
        res.status(400).json({
          success: false,
          error: 'Quantity is required and must be a non-negative number',
        });
        return;
      }

      if (price === undefined || typeof price !== 'number' || price < 0) {
        res.status(400).json({
          success: false,
          error: 'Price is required and must be a non-negative number',
        });
        return;
      }

      if (!category || typeof category !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Category is required and must be a string',
        });
        return;
      }

      const newResource = await ResourceService.createResource({
        name,
        description,
        quantity,
        price,
        category,
      });

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: newResource,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create resource',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update resource (PUT - full update)
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format',
        });
        return;
      }

      const { name, description, quantity, price, category } = req.body;

      // For PUT, all fields are required
      if (!name || !category || quantity === undefined || price === undefined) {
        res.status(400).json({
          success: false,
          error: 'PUT requires all fields: name, quantity, price, category',
        });
        return;
      }

      const updatedResource = await ResourceService.updateResource(id, {
        name,
        description,
        quantity,
        price,
        category,
      });

      if (!updatedResource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: updatedResource,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update resource',
        message: error instanceof Error ? error.message : 'Unknown error',
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
          error: 'Invalid ID format',
        });
        return;
      }

      const updates: UpdateResourceDTO = {};

      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.quantity !== undefined) updates.quantity = req.body.quantity;
      if (req.body.price !== undefined) updates.price = req.body.price;
      if (req.body.category !== undefined) updates.category = req.body.category;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          error: 'No valid fields to update',
        });
        return;
      }

      const updatedResource = await ResourceService.updateResource(id, updates);

      if (!updatedResource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: updatedResource,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update resource',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete resource
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format',
        });
        return;
      }

      const deleted = await ResourceService.deleteResource(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete resource',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get statistics
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await ResourceService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
