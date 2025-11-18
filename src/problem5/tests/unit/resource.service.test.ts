import { ResourceService } from '../../src/services/resource.service';
import { ResourceModel } from '../../src/models/resource.model';
import { CreateResourceDTO, Resource } from '../../src/types/resource.types';

// Mock the ResourceModel
jest.mock('../../src/models/resource.model');

describe('ResourceService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllResources', () => {
    it('should return all resources', async () => {
      const mockResources: Resource[] = [
        {
          id: 1,
          name: 'Test Resource',
          description: 'Test Description',
          quantity: 10,
          price: 99.99,
          category: 'Electronics',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (ResourceModel.findAll as jest.Mock).mockResolvedValue(mockResources);

      const result = await ResourceService.getAllResources();

      expect(result).toEqual(mockResources);
      expect(ResourceModel.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered resources', async () => {
      const filters = { category: 'Electronics', minPrice: 50 };
      const mockResources: Resource[] = [];

      (ResourceModel.findAll as jest.Mock).mockResolvedValue(mockResources);

      await ResourceService.getAllResources(filters);

      expect(ResourceModel.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('getResourceById', () => {
    it('should return a resource by id', async () => {
      const mockResource: Resource = {
        id: 1,
        name: 'Test Resource',
        description: 'Test Description',
        quantity: 10,
        price: 99.99,
        category: 'Electronics',
        created_at: new Date(),
        updated_at: new Date(),
      };

      (ResourceModel.findById as jest.Mock).mockResolvedValue(mockResource);

      const result = await ResourceService.getResourceById(1);

      expect(result).toEqual(mockResource);
      expect(ResourceModel.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when resource not found', async () => {
      (ResourceModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await ResourceService.getResourceById(999);

      expect(result).toBeNull();
    });
  });

  describe('createResource', () => {
    it('should create a resource successfully', async () => {
      const createDTO: CreateResourceDTO = {
        name: 'New Resource',
        description: 'New Description',
        quantity: 5,
        price: 49.99,
        category: 'Books',
      };

      const mockCreatedResource: Resource = {
        id: 1,
        ...createDTO,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (ResourceModel.create as jest.Mock).mockResolvedValue(mockCreatedResource);

      const result = await ResourceService.createResource(createDTO);

      expect(result).toEqual(mockCreatedResource);
      expect(ResourceModel.create).toHaveBeenCalledWith(createDTO);
    });

    it('should throw error when name is empty', async () => {
      const createDTO: CreateResourceDTO = {
        name: '',
        quantity: 5,
        price: 49.99,
        category: 'Books',
      };

      await expect(ResourceService.createResource(createDTO)).rejects.toThrow(
        'Name is required'
      );
    });

    it('should throw error when quantity is negative', async () => {
      const createDTO: CreateResourceDTO = {
        name: 'Test',
        quantity: -5,
        price: 49.99,
        category: 'Books',
      };

      await expect(ResourceService.createResource(createDTO)).rejects.toThrow(
        'Quantity must be non-negative'
      );
    });

    it('should throw error when price is negative', async () => {
      const createDTO: CreateResourceDTO = {
        name: 'Test',
        quantity: 5,
        price: -49.99,
        category: 'Books',
      };

      await expect(ResourceService.createResource(createDTO)).rejects.toThrow(
        'Price must be non-negative'
      );
    });

    it('should throw error when category is empty', async () => {
      const createDTO: CreateResourceDTO = {
        name: 'Test',
        quantity: 5,
        price: 49.99,
        category: '',
      };

      await expect(ResourceService.createResource(createDTO)).rejects.toThrow(
        'Category is required'
      );
    });
  });

  describe('updateResource', () => {
    it('should update a resource successfully', async () => {
      const updateData = { name: 'Updated Name', price: 79.99 };
      const mockExistingResource: Resource = {
        id: 1,
        name: 'Old Name',
        description: 'Description',
        quantity: 10,
        price: 99.99,
        category: 'Electronics',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockUpdatedResource: Resource = {
        ...mockExistingResource,
        ...updateData,
      };

      (ResourceModel.findById as jest.Mock).mockResolvedValue(mockExistingResource);
      (ResourceModel.update as jest.Mock).mockResolvedValue(mockUpdatedResource);

      const result = await ResourceService.updateResource(1, updateData);

      expect(result).toEqual(mockUpdatedResource);
      expect(ResourceModel.findById).toHaveBeenCalledWith(1);
      expect(ResourceModel.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should return null when resource not found', async () => {
      (ResourceModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await ResourceService.updateResource(999, { name: 'Test' });

      expect(result).toBeNull();
      expect(ResourceModel.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource successfully', async () => {
      (ResourceModel.delete as jest.Mock).mockResolvedValue(true);

      const result = await ResourceService.deleteResource(1);

      expect(result).toBe(true);
      expect(ResourceModel.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when resource not found', async () => {
      (ResourceModel.delete as jest.Mock).mockResolvedValue(false);

      const result = await ResourceService.deleteResource(999);

      expect(result).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      const mockStats = {
        totalResources: 10,
        categories: [{ category: 'Electronics' }, { category: 'Books' }],
      };

      (ResourceModel.getStats as jest.Mock).mockResolvedValue(mockStats);

      const result = await ResourceService.getStats();

      expect(result).toEqual(mockStats);
      expect(ResourceModel.getStats).toHaveBeenCalled();
    });
  });
});
