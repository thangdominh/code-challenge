import { UserService } from '../../src/services/user.service';
import { UserModel } from '../../src/models/user.model';
import { CreateUserDTO, User } from '../../src/types/user.types';

// Mock the UserModel
jest.mock('../../src/models/user.model');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 28,
          role: 'Developer',
          status: 'active',
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(UserModel.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return filtered users', async () => {
      const filters = { role: 'Developer', status: 'active' };
      const mockUsers: User[] = [];

      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      await UserService.getAllUsers(filters);

      expect(UserModel.findAll).toHaveBeenCalledWith(filters);
    });

    it('should return users with sort options', async () => {
      const filters = { sortBy: 'name' as const, sortOrder: 'ASC' as const };
      const mockUsers: User[] = [];

      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      await UserService.getAllUsers(filters);

      expect(UserModel.findAll).toHaveBeenCalledWith(filters);
    });

    it('should return paginated users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 28,
          role: 'Developer',
          status: 'active',
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (UserModel.count as jest.Mock).mockResolvedValue(15);
      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers({ page: 1, limit: 10 });

      expect('pagination' in result).toBe(true);
      if ('pagination' in result) {
        expect(result.pagination.currentPage).toBe(1);
        expect(result.pagination.pageSize).toBe(10);
        expect(result.pagination.totalCount).toBe(15);
        expect(result.pagination.totalPages).toBe(2);
        expect(result.pagination.hasNextPage).toBe(true);
        expect(result.pagination.hasPreviousPage).toBe(false);
        expect(result.data).toEqual(mockUsers);
      }
    });

    it('should sanitize pagination parameters', async () => {
      const mockUsers: User[] = [];
      (UserModel.count as jest.Mock).mockResolvedValue(0);
      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      // Test with negative page
      await UserService.getAllUsers({ page: -1, limit: 10 });
      expect(UserModel.findAll).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 10 }));

      // Test with limit exceeding max
      await UserService.getAllUsers({ page: 1, limit: 200 });
      expect(UserModel.findAll).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 100 }));
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 28,
        role: 'Developer',
        status: 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(UserModel.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await UserService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 28,
        role: 'Developer',
        status: 'active',
      };

      const mockCreatedUser: User = {
        id: 1,
        name: createDTO.name,
        email: createDTO.email,
        age: createDTO.age!,
        role: createDTO.role,
        status: createDTO.status || 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await UserService.createUser(createDTO);

      expect(result).toEqual(mockCreatedUser);
      expect(UserModel.findByEmail).toHaveBeenCalledWith(createDTO.email);
      expect(UserModel.create).toHaveBeenCalledWith(createDTO);
    });

    it('should throw error when name is empty', async () => {
      const createDTO: CreateUserDTO = {
        name: '',
        email: 'john@example.com',
        role: 'Developer',
      };

      await expect(UserService.createUser(createDTO)).rejects.toThrow('Name is required');
    });

    it('should throw error when email is empty', async () => {
      const createDTO: CreateUserDTO = {
        name: 'John Doe',
        email: '',
        role: 'Developer',
      };

      await expect(UserService.createUser(createDTO)).rejects.toThrow('Email is required');
    });

    it('should throw error when email format is invalid', async () => {
      const createDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'invalid-email',
        role: 'Developer',
      };

      await expect(UserService.createUser(createDTO)).rejects.toThrow('Invalid email format');
    });

    it('should throw error when email already exists', async () => {
      const createDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Developer',
      };

      const existingUser: User = {
        id: 1,
        name: 'Existing User',
        email: 'john.doe@example.com',
        age: 30,
        role: 'Manager',
        status: 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (UserModel.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(UserService.createUser(createDTO)).rejects.toThrow('Email already exists');
    });

    it('should throw error when age is invalid', async () => {
      const createDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        age: -5,
        role: 'Developer',
      };

      await expect(UserService.createUser(createDTO)).rejects.toThrow(
        'Age must be between 0 and 150'
      );
    });

    it('should throw error when role is empty', async () => {
      const createDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        role: '',
      };

      await expect(UserService.createUser(createDTO)).rejects.toThrow('Role is required');
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateData = { name: 'Updated Name', age: 30 };
      const mockExistingUser: User = {
        id: 1,
        name: 'Old Name',
        email: 'john@example.com',
        age: 28,
        role: 'Developer',
        status: 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockUpdatedUser: User = {
        ...mockExistingUser,
        ...updateData,
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockExistingUser);
      (UserModel.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updateUser(1, updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(UserModel.findById).toHaveBeenCalledWith(1);
      expect(UserModel.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should return null when user not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await UserService.updateUser(999, { name: 'Test' });

      expect(result).toBeNull();
      expect(UserModel.update).not.toHaveBeenCalled();
    });

    it('should check email uniqueness when updating email', async () => {
      const existingUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 28,
        role: 'Developer',
        status: 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const anotherUser: User = {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 30,
        role: 'Designer',
        status: 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(anotherUser);

      await expect(
        UserService.updateUser(1, { email: 'jane@example.com' })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully (soft delete)', async () => {
      (UserModel.delete as jest.Mock).mockResolvedValue(true);

      const result = await UserService.deleteUser(1);

      expect(result).toBe(true);
      expect(UserModel.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when user not found', async () => {
      (UserModel.delete as jest.Mock).mockResolvedValue(false);

      const result = await UserService.deleteUser(999);

      expect(result).toBe(false);
    });
  });

  describe('restoreUser', () => {
    it('should restore a soft-deleted user successfully', async () => {
      const mockRestoredUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 28,
        role: 'Developer',
        status: 'active',
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (UserModel.restore as jest.Mock).mockResolvedValue(mockRestoredUser);

      const result = await UserService.restoreUser(1);

      expect(result).toEqual(mockRestoredUser);
      expect(UserModel.restore).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found or not deleted', async () => {
      (UserModel.restore as jest.Mock).mockResolvedValue(null);

      const result = await UserService.restoreUser(999);

      expect(result).toBeNull();
    });
  });

  describe('hardDeleteUser', () => {
    it('should permanently delete a user successfully', async () => {
      (UserModel.hardDelete as jest.Mock).mockResolvedValue(true);

      const result = await UserService.hardDeleteUser(1);

      expect(result).toBe(true);
      expect(UserModel.hardDelete).toHaveBeenCalledWith(1);
    });

    it('should return false when user not found', async () => {
      (UserModel.hardDelete as jest.Mock).mockResolvedValue(false);

      const result = await UserService.hardDeleteUser(999);

      expect(result).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      const mockStats = {
        totalUsers: 15,
        roles: [{ role: 'Developer' }, { role: 'Designer' }],
        statusBreakdown: [
          { status: 'active', count: 13 },
          { status: 'inactive', count: 2 },
        ],
      };

      (UserModel.getStats as jest.Mock).mockResolvedValue(mockStats);

      const result = await UserService.getStats();

      expect(result).toEqual(mockStats);
      expect(UserModel.getStats).toHaveBeenCalled();
    });
  });
});
