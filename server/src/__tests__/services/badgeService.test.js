const badgeService = require('../../services/badgeService');
const Badge = require('../../models/Badge');

// Мокування моделі Badge
jest.mock('../../models/Badge');

describe('BadgeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('повинен створити новий значок', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      const mockBadge = {
        id: 'badge123',
        user: userId,
        course: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Badge.create.mockResolvedValue(mockBadge);

      // Виконання
      const result = await badgeService.create(userId, courseId);

      // Перевірка
      expect(Badge.create).toHaveBeenCalledWith({
        user: userId,
        course: courseId
      });
      expect(result).toEqual(mockBadge);
    });

    it('повинен створити значок з правильними полями', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      const mockBadge = {
        id: 'badge123',
        user: userId,
        course: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Badge.create.mockResolvedValue(mockBadge);

      // Виконання
      const result = await badgeService.create(userId, courseId);

      // Перевірка
      expect(Badge.create).toHaveBeenCalledWith({
        user: userId,
        course: courseId
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('user', userId);
      expect(result).toHaveProperty('course', courseId);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('повинен обробити помилку від моделі', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      const error = new Error('Database error');
      Badge.create.mockRejectedValue(error);

      // Виконання і Перевірка
      await expect(badgeService.create(userId, courseId))
        .rejects
        .toThrow('Database error');
    });
  });
}); 