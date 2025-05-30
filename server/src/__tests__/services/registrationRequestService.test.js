const registrationRequestService = require('../../services/registrationRequestService');
const userRepository = require('../../repositories/userRepository');
const reqRepo = require('../../repositories/registrationRequestRepository');
const EmailService = require('../../utils/EmailService');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// Мокування залежностей
jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/registrationRequestRepository');
jest.mock('../../utils/EmailService');
jest.mock('../../models/User');
jest.mock('bcryptjs');

describe('RegistrationRequestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitRequest', () => {
    it('повинен створити нову заявку', async () => {
      // Підготовка
      const dto = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        password: 'password123'
      };

      userRepository.findByEmail.mockResolvedValue(null);
      reqRepo.findPendingByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockRequest = {
        id: 'request123',
        ...dto,
        password: 'hashedPassword',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      reqRepo.create.mockResolvedValue(mockRequest);

      // Виконання
      const result = await registrationRequestService.submitRequest(dto);

      // Перевірка
      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(reqRepo.findPendingByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(reqRepo.create).toHaveBeenCalledWith({
        ...dto,
        password: 'hashedPassword'
      });
      expect(result).toEqual(mockRequest);
    });

    it('повинен викинути помилку, якщо email вже використовується користувачем', async () => {
      // Підготовка
      const dto = {
        name: 'Test User',
        email: 'existing@example.com',
        role: 'user',
        password: 'password123'
      };

      userRepository.findByEmail.mockResolvedValue({ id: 'user123' });

      // Виконання і Перевірка
      const error = await registrationRequestService.submitRequest(dto).catch(e => e);
      expect(error.message).toBe('Email вже використовується');
      expect(error.statusCode).toBe(400);
    });

    it('повинен викинути помилку, якщо email вже використовується в заявці', async () => {
      // Підготовка
      const dto = {
        name: 'Test User',
        email: 'existing@example.com',
        role: 'user',
        password: 'password123'
      };

      userRepository.findByEmail.mockResolvedValue(null);
      reqRepo.findPendingByEmail.mockResolvedValue({ id: 'request123' });

      // Виконання і Перевірка
      const error = await registrationRequestService.submitRequest(dto).catch(e => e);
      expect(error.message).toBe('Email вже використовується');
      expect(error.statusCode).toBe(400);
    });

    it('повинен викинути помилку, якщо відсутні обов\'язкові поля', async () => {
      // Підготовка
      const dto = {
        name: 'Test User',
        // email відсутній
        role: 'user',
        password: 'password123'
      };

      // Виконання і Перевірка
      await expect(registrationRequestService.submitRequest(dto))
        .rejects
        .toThrow();
    });
  });

  describe('approveRequest', () => {
    it('повинен затвердити заявку та створити користувача', async () => {
      // Підготовка
      const requestId = 'request123';
      const mockRequest = {
        id: requestId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      reqRepo.findById.mockResolvedValue(mockRequest);
      
      const mockUser = {
        id: 'user123',
        ...mockRequest,
        status: undefined
      };
      
      User.create.mockResolvedValue(mockUser);
      reqRepo.save.mockResolvedValue({ ...mockRequest, status: 'approved' });
      EmailService.sendWelcome.mockResolvedValue();

      // Виконання
      const result = await registrationRequestService.approveRequest(requestId);

      // Перевірка
      expect(reqRepo.findById).toHaveBeenCalledWith(requestId);
      expect(User.create).toHaveBeenCalledWith({
        name: mockRequest.name,
        email: mockRequest.email,
        password: mockRequest.password,
        role: mockRequest.role
      });
      expect(reqRepo.save).toHaveBeenCalled();
      expect(EmailService.sendWelcome).toHaveBeenCalledWith(mockRequest.email);
      expect(result).toEqual(mockUser);
    });

    it('повинен викинути помилку, якщо заявка не знайдена', async () => {
      // Підготовка
      const requestId = 'nonexistent';
      reqRepo.findById.mockResolvedValue(null);

      // Виконання і Перевірка
      const error = await registrationRequestService.approveRequest(requestId).catch(e => e);
      expect(error.message).toBe('Заявка не знайдена');
      expect(error.statusCode).toBe(404);
    });

    it('повинен викинути помилку, якщо заявка вже оброблена', async () => {
      // Підготовка
      const requestId = 'request123';
      const mockRequest = {
        id: requestId,
        status: 'approved'
      };

      reqRepo.findById.mockResolvedValue(mockRequest);

      // Виконання і Перевірка
      const error = await registrationRequestService.approveRequest(requestId).catch(e => e);
      expect(error.message).toBe('Заявка вже оброблена');
      expect(error.statusCode).toBe(400);
    });

    it('повинен викинути помилку, якщо створення користувача не вдалося', async () => {
      // Підготовка
      const requestId = 'request123';
      const mockRequest = {
        id: requestId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        status: 'pending'
      };

      reqRepo.findById.mockResolvedValue(mockRequest);
      User.create.mockRejectedValue(new Error('Database error'));

      // Виконання і Перевірка
      await expect(registrationRequestService.approveRequest(requestId))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('getAllRequests', () => {
    it('повинен повернути всі заявки', async () => {
      // Підготовка
      const mockRequests = [
        { 
          id: 'request1', 
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: 'request2', 
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      reqRepo.findAll.mockResolvedValue(mockRequests);

      // Виконання
      const result = await registrationRequestService.getAllRequests();

      // Перевірка
      expect(reqRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRequests);
    });

    it('повинен повернути порожній масив, якщо заявок немає', async () => {
      // Підготовка
      reqRepo.findAll.mockResolvedValue([]);

      // Виконання
      const result = await registrationRequestService.getAllRequests();

      // Перевірка
      expect(reqRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getRequestById', () => {
    it('повинен повернути заявку за ID', async () => {
      // Підготовка
      const requestId = 'request123';
      const mockRequest = {
        id: requestId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      reqRepo.findById.mockResolvedValue(mockRequest);

      // Виконання
      const result = await registrationRequestService.getRequestById(requestId);

      // Перевірка
      expect(reqRepo.findById).toHaveBeenCalledWith(requestId);
      expect(result).toEqual(mockRequest);
    });

    it('повинен викинути помилку, якщо заявка не знайдена', async () => {
      // Підготовка
      const requestId = 'nonexistent';
      reqRepo.findById.mockResolvedValue(null);

      // Виконання і Перевірка
      const error = await registrationRequestService.getRequestById(requestId).catch(e => e);
      expect(error.message).toBe('Заявка не знайдена');
      expect(error.statusCode).toBe(404);
    });
  });
}); 