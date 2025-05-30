const authService = require('../../services/authService');
const userRepository = require('../../repositories/userRepository');
const jwt = require('jsonwebtoken');

jest.mock('../../repositories/userRepository');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Встановлюємо змінні середовища для тестів
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRES_IN = '7d';
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      // Підготовка тестових даних
      const loginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        _email: 'test@example.com',
        role: 'student',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      const mockToken = 'jwt-token';

      // Налаштування моків
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      // Виконання тесту
      const result = await authService.login(loginDto);

      // Перевірки
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockUser.matchPassword).toHaveBeenCalledWith(loginDto.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          email: mockUser._email,
          role: mockUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      expect(result).toBe(mockToken);
    });

    it('should throw error if user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto))
        .rejects.toThrowError('Невірні облікові дані');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw error if password is incorrect', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        _email: 'test@example.com',
        role: 'student',
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(loginDto))
        .rejects.toThrowError('Невірні облікові дані');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockUser.matchPassword).toHaveBeenCalledWith(loginDto.password);
    });

    it('should throw error with correct status code', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      userRepository.findByEmail.mockResolvedValue(null);

      try {
        await authService.login(loginDto);
      } catch (error) {
        expect(error.message).toBe('Невірні облікові дані');
        expect(error.statusCode).toBe(401);
      }
    });
  });
});