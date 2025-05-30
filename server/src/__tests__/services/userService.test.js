const userService = require('../../services/userService');
const userRepository = require('../../repositories/userRepository');
const bcrypt = require('bcryptjs');

jest.mock('../../repositories/userRepository');
jest.mock('bcryptjs');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      };
      const hashedPassword = 'hashedPassword123';
      const mockUser = { 
        id: 'user123',
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      };

      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if name is missing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(userService.createUser(userData))
        .rejects.toThrow('name, email та password — обов'+"’"+'язкові');
    });

    it('should throw error if email is missing', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123'
      };

      await expect(userService.createUser(userData))
        .rejects.toThrow('name, email та password — обов'+"’"+'язкові');
    });

    it('should throw error if password is missing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      await expect(userService.createUser(userData))
        .rejects.toThrow('name, email та password — обов'+"’"+'язкові');
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      const existingUser = { id: 'user456', email: 'test@example.com' };

      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(userData))
        .rejects.toThrow('Email уже використовується');
      
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 'user1', name: 'User 1', email: 'user1@example.com' },
        { id: 'user2', name: 'User 2', email: 'user2@example.com' }
      ];

      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userId = 'user123';
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com'
      };

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      const userId = 'nonexistent';

      userRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById(userId))
        .rejects.toThrow('Користувача не знайдено');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully without password', async () => {
      const userId = 'user123';
      const updateData = { name: 'Updated User', email: 'updated@example.com' };
      const mockUser = { id: userId, ...updateData };

      userRepository.updateById.mockResolvedValue(mockUser);

      const result = await userService.updateUser(userId, updateData);

      expect(userRepository.updateById).toHaveBeenCalledWith(userId, updateData);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should update user with hashed password', async () => {
      const userId = 'user123';
      const updateData = { name: 'Updated User', password: 'newPassword123' };
      const hashedPassword = 'hashedNewPassword123';
      const expectedUpdateData = { name: 'Updated User', password: hashedPassword };
      const mockUser = { id: userId, ...expectedUpdateData };

      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.updateById.mockResolvedValue(mockUser);

      const result = await userService.updateUser(userId, updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(userRepository.updateById).toHaveBeenCalledWith(userId, expectedUpdateData);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      const userId = 'nonexistent';
      const updateData = { name: 'Updated User' };

      userRepository.updateById.mockResolvedValue(null);

      await expect(userService.updateUser(userId, updateData))
        .rejects.toThrow('Користувача не знайдено');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 'user123';

      userRepository.deleteById.mockResolvedValue(true);

      const result = await userService.deleteUser(userId);

      expect(userRepository.deleteById).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should throw error if user not found', async () => {
      const userId = 'nonexistent';

      userRepository.deleteById.mockResolvedValue(null);

      await expect(userService.deleteUser(userId))
        .rejects.toThrow('Користувача не знайдено');
    });
  });
});