const lessonService = require('../../services/lessonService');
const lessonRepository = require('../../repositories/lessonRepository');
const moduleRepository = require('../../repositories/moduleRepository');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// Мокування залежностей
jest.mock('../../repositories/lessonRepository');
jest.mock('../../repositories/moduleRepository');
jest.mock('uuid');
jest.mock('mongoose');

describe('LessonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLesson', () => {
    const validDto = {
      title: 'Test Lesson',
      blocks: [
        { type: 'text', content: 'Hello World' },
        { type: 'video', url: 'http://example.com/video.mp4' }
      ],
      courseId: '507f1f77bcf86cd799439011'
    };

    it('should create lesson with valid data', async () => {
      const mockCreatedLesson = { _id: 'lesson123', ...validDto };
      const mockUuid = 'uuid-123';

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      uuidv4.mockReturnValue(mockUuid);
      lessonRepository.create.mockResolvedValue(mockCreatedLesson);

      const result = await lessonService.createLesson(validDto);

      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(validDto.courseId);
      expect(lessonRepository.create).toHaveBeenCalledWith({
        title: validDto.title,
        blocks: [
          { id: mockUuid, type: 'text', content: 'Hello World' },
          { id: mockUuid, type: 'video', url: 'http://example.com/video.mp4' }
        ],
        courseId: validDto.courseId
      });
      expect(result).toEqual(mockCreatedLesson);
    });

    it('should preserve existing block IDs', async () => {
      const dtoWithIds = {
        ...validDto,
        blocks: [
          { id: 'existing-id-1', type: 'text', content: 'Hello' },
          { type: 'video', url: 'video.mp4' }
        ]
      };
      const newUuid = 'new-uuid';

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      uuidv4.mockReturnValue(newUuid);
      lessonRepository.create.mockResolvedValue({});

      await lessonService.createLesson(dtoWithIds);

      expect(lessonRepository.create).toHaveBeenCalledWith({
        title: dtoWithIds.title,
        blocks: [
          { id: 'existing-id-1', type: 'text', content: 'Hello' },
          { id: newUuid, type: 'video', url: 'video.mp4' }
        ],
        courseId: dtoWithIds.courseId
      });
    });

    it('should throw error for invalid courseId format', async () => {
      const invalidDto = { ...validDto, courseId: 'invalid-id' };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await expect(lessonService.createLesson(invalidDto))
        .rejects.toThrow('Невірний формат courseId');

      try {
        await lessonService.createLesson(invalidDto);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw error when title is missing', async () => {
      const dtoWithoutTitle = { ...validDto };
      delete dtoWithoutTitle.title;

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);

      await expect(lessonService.createLesson(dtoWithoutTitle))
        .rejects.toThrow('Поле title є обов'+"’"+'язковим і має бути рядком');

      try {
        await lessonService.createLesson(dtoWithoutTitle);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw error when title is not a string', async () => {
      const dtoWithInvalidTitle = { ...validDto, title: 123 };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);

      await expect(lessonService.createLesson(dtoWithInvalidTitle))
        .rejects.toThrow('Поле title є обов'+"’"+'язковим і має бути рядком');
    });

    it('should throw error when title is empty string', async () => {
      const dtoWithEmptyTitle = { ...validDto, title: '' };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);

      await expect(lessonService.createLesson(dtoWithEmptyTitle))
        .rejects.toThrow('Поле title є обов'+"’"+'язковим і має бути рядком');
    });

    it('should throw error when blocks is not an array', async () => {
      const dtoWithInvalidBlocks = { ...validDto, blocks: 'not an array' };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);

      await expect(lessonService.createLesson(dtoWithInvalidBlocks))
        .rejects.toThrow('Поле blocks має бути масивом');

      try {
        await lessonService.createLesson(dtoWithInvalidBlocks);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should handle empty blocks array', async () => {
      const dtoWithEmptyBlocks = { ...validDto, blocks: [] };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      lessonRepository.create.mockResolvedValue({});

      await lessonService.createLesson(dtoWithEmptyBlocks);

      expect(lessonRepository.create).toHaveBeenCalledWith({
        title: validDto.title,
        blocks: [],
        courseId: validDto.courseId
      });
    });

    it('should handle repository errors', async () => {
      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      lessonRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(lessonService.createLesson(validDto))
        .rejects.toThrow('Database error');
    });
  });

  describe('getAllLessons', () => {
    it('should return all lessons', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Lesson 1' },
        { _id: 'lesson2', title: 'Lesson 2' }
      ];

      lessonRepository.findAll.mockResolvedValue(mockLessons);

      const result = await lessonService.getAllLessons();

      expect(lessonRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockLessons);
    });

    it('should return empty array when no lessons exist', async () => {
      lessonRepository.findAll.mockResolvedValue([]);

      const result = await lessonService.getAllLessons();

      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      lessonRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(lessonService.getAllLessons())
        .rejects.toThrow('Database error');
    });
  });

  describe('getLessonById', () => {
    const lessonId = 'lesson123';

    it('should return lesson when found', async () => {
      const mockLesson = { _id: lessonId, title: 'Test Lesson' };

      lessonRepository.findById.mockResolvedValue(mockLesson);

      const result = await lessonService.getLessonById(lessonId);

      expect(lessonRepository.findById).toHaveBeenCalledWith(lessonId);
      expect(result).toEqual(mockLesson);
    });

    it('should throw 404 error when lesson not found', async () => {
      lessonRepository.findById.mockResolvedValue(null);

      await expect(lessonService.getLessonById(lessonId))
        .rejects.toThrow('Урок не знайдено');

      try {
        await lessonService.getLessonById(lessonId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle repository errors', async () => {
      lessonRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(lessonService.getLessonById(lessonId))
        .rejects.toThrow('Database error');
    });
  });

  describe('getLessonsByCourseId', () => {
    const courseId = 'course123';

    it('should return lessons for given course', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Lesson 1', courseId },
        { _id: 'lesson2', title: 'Lesson 2', courseId }
      ];

      lessonRepository.findByCourseId.mockResolvedValue(mockLessons);

      const result = await lessonService.getLessonsByCourseId(courseId);

      expect(lessonRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockLessons);
    });

    it('should return empty array when no lessons for course', async () => {
      lessonRepository.findByCourseId.mockResolvedValue([]);

      const result = await lessonService.getLessonsByCourseId(courseId);

      expect(result).toEqual([]);
    });
  });

  describe('getAvailableLessonsByCourseId', () => {
    const courseId = 'course123';

    it('should return available lessons (not assigned to modules)', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Available Lesson 1' },
        { _id: 'lesson2', title: 'Available Lesson 2' },
        { _id: 'lesson3', title: 'Assigned Lesson' }
      ];

      const mockModules = [
        {
          _id: 'module1',
          lessons: [{ _id: 'lesson3' }]
        }
      ];

      lessonRepository.findByCourseId.mockResolvedValue(mockLessons);
      moduleRepository.findByCourseId.mockResolvedValue(mockModules);

      const result = await lessonService.getAvailableLessonsByCourseId(courseId);

      expect(lessonRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(moduleRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { _id: 'lesson1', title: 'Available Lesson 1' },
        { _id: 'lesson2', title: 'Available Lesson 2' }
      ]);
    });

    it('should handle lessons referenced as strings in modules', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Lesson 1' },
        { _id: 'lesson2', title: 'Lesson 2' }
      ];

      const mockModules = [
        {
          _id: 'module1',
          lessons: ['lesson2'] // String reference instead of object
        }
      ];

      lessonRepository.findByCourseId.mockResolvedValue(mockLessons);
      moduleRepository.findByCourseId.mockResolvedValue(mockModules);

      const result = await lessonService.getAvailableLessonsByCourseId(courseId);

      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe('lesson1');
    });

    it('should handle multiple modules with multiple lessons', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Lesson 1' },
        { _id: 'lesson2', title: 'Lesson 2' },
        { _id: 'lesson3', title: 'Lesson 3' },
        { _id: 'lesson4', title: 'Lesson 4' }
      ];

      const mockModules = [
        {
          _id: 'module1',
          lessons: [{ _id: 'lesson1' }, { _id: 'lesson3' }]
        },
        {
          _id: 'module2',
          lessons: ['lesson2']
        }
      ];

      lessonRepository.findByCourseId.mockResolvedValue(mockLessons);
      moduleRepository.findByCourseId.mockResolvedValue(mockModules);

      const result = await lessonService.getAvailableLessonsByCourseId(courseId);

      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe('lesson4');
    });

    it('should return all lessons when no modules exist', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Lesson 1' },
        { _id: 'lesson2', title: 'Lesson 2' }
      ];

      lessonRepository.findByCourseId.mockResolvedValue(mockLessons);
      moduleRepository.findByCourseId.mockResolvedValue([]);

      const result = await lessonService.getAvailableLessonsByCourseId(courseId);

      expect(result).toEqual(mockLessons);
    });

    it('should return empty array when all lessons are assigned', async () => {
      const mockLessons = [
        { _id: 'lesson1', title: 'Lesson 1' }
      ];

      const mockModules = [
        {
          _id: 'module1',
          lessons: [{ _id: 'lesson1' }]
        }
      ];

      lessonRepository.findByCourseId.mockResolvedValue(mockLessons);
      moduleRepository.findByCourseId.mockResolvedValue(mockModules);

      const result = await lessonService.getAvailableLessonsByCourseId(courseId);

      expect(result).toEqual([]);
    });
  });

  describe('updateLesson', () => {
    const lessonId = 'lesson123';

    it('should update lesson with valid data', async () => {
      const updateDto = {
        title: 'Updated Title',
        blocks: [{ type: 'text', content: 'Updated content' }]
      };
      const mockUpdatedLesson = { _id: lessonId, ...updateDto };
      const mockUuid = 'new-uuid';

      uuidv4.mockReturnValue(mockUuid);
      lessonRepository.updateById.mockResolvedValue(mockUpdatedLesson);

      const result = await lessonService.updateLesson(lessonId, updateDto);

      expect(lessonRepository.updateById).toHaveBeenCalledWith(lessonId, {
        title: 'Updated Title',
        blocks: [{ id: mockUuid, type: 'text', content: 'Updated content' }]
      });
      expect(result).toEqual(mockUpdatedLesson);
    });

    it('should update only title when blocks not provided', async () => {
      const updateDto = { title: 'Updated Title Only' };
      const mockUpdatedLesson = { _id: lessonId, ...updateDto };

      lessonRepository.updateById.mockResolvedValue(mockUpdatedLesson);

      const result = await lessonService.updateLesson(lessonId, updateDto);

      expect(lessonRepository.updateById).toHaveBeenCalledWith(lessonId, updateDto);
      expect(result).toEqual(mockUpdatedLesson);
    });

    it('should preserve existing block IDs during update', async () => {
      const updateDto = {
        blocks: [
          { id: 'existing-id', type: 'text', content: 'Existing' },
          { type: 'video', url: 'new-video.mp4' }
        ]
      };
      const newUuid = 'new-uuid';

      uuidv4.mockReturnValue(newUuid);
      lessonRepository.updateById.mockResolvedValue({});

      await lessonService.updateLesson(lessonId, updateDto);

      expect(lessonRepository.updateById).toHaveBeenCalledWith(lessonId, {
        blocks: [
          { id: 'existing-id', type: 'text', content: 'Existing' },
          { id: newUuid, type: 'video', url: 'new-video.mp4' }
        ]
      });
    });

    it('should throw error when title is not a string', async () => {
      const invalidDto = { title: 123 };

      await expect(lessonService.updateLesson(lessonId, invalidDto))
        .rejects.toThrow('title має бути рядком');

      try {
        await lessonService.updateLesson(lessonId, invalidDto);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should allow empty string as title', async () => {
      const updateDto = { title: '' };

      lessonRepository.updateById.mockResolvedValue({});

      await lessonService.updateLesson(lessonId, updateDto);

      expect(lessonRepository.updateById).toHaveBeenCalledWith(lessonId, updateDto);
    });

    it('should throw error when blocks is not an array', async () => {
      const invalidDto = { blocks: 'not an array' };

      await expect(lessonService.updateLesson(lessonId, invalidDto))
        .rejects.toThrow('blocks має бути масивом');

      try {
        await lessonService.updateLesson(lessonId, invalidDto);
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should handle empty blocks array', async () => {
      const updateDto = { blocks: [] };

      lessonRepository.updateById.mockResolvedValue({});

      await lessonService.updateLesson(lessonId, updateDto);

      expect(lessonRepository.updateById).toHaveBeenCalledWith(lessonId, {
        blocks: []
      });
    });

    it('should throw 404 error when lesson not found', async () => {
      const updateDto = { title: 'Updated Title' };

      lessonRepository.updateById.mockResolvedValue(null);

      await expect(lessonService.updateLesson(lessonId, updateDto))
        .rejects.toThrow('Урок не знайдено');

      try {
        await lessonService.updateLesson(lessonId, updateDto);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle undefined values in dto', async () => {
      const updateDto = { 
        title: undefined, 
        blocks: undefined, 
        someOtherField: 'value' 
      };

      lessonRepository.updateById.mockResolvedValue({});

      await lessonService.updateLesson(lessonId, updateDto);

      expect(lessonRepository.updateById).toHaveBeenCalledWith(lessonId, updateDto);
    });
  });

  describe('deleteLesson', () => {
    const lessonId = 'lesson123';

    it('should delete lesson when found', async () => {
      const mockDeletedLesson = { _id: lessonId, title: 'Deleted Lesson' };

      lessonRepository.deleteById.mockResolvedValue(mockDeletedLesson);

      const result = await lessonService.deleteLesson(lessonId);

      expect(lessonRepository.deleteById).toHaveBeenCalledWith(lessonId);
      expect(result).toEqual(mockDeletedLesson);
    });

    it('should throw 404 error when lesson not found', async () => {
      lessonRepository.deleteById.mockResolvedValue(null);

      await expect(lessonService.deleteLesson(lessonId))
        .rejects.toThrow('Урок не знайдено');

      try {
        await lessonService.deleteLesson(lessonId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle repository errors', async () => {
      lessonRepository.deleteById.mockRejectedValue(new Error('Database error'));

      await expect(lessonService.deleteLesson(lessonId))
        .rejects.toThrow('Database error');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null dto in createLesson', async () => {
      await expect(lessonService.createLesson(null))
        .rejects.toThrow();
    });

    it('should handle undefined dto in createLesson', async () => {
      await expect(lessonService.createLesson(undefined))
        .rejects.toThrow();
    });

    it('should handle special characters in lesson title', async () => {
      const specialDto = {
        title: 'Урок з спеціальними символами: <>?:"{}[]+=',
        blocks: [],
        courseId: '507f1f77bcf86cd799439011'
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      lessonRepository.create.mockResolvedValue({});

      await lessonService.createLesson(specialDto);

      expect(lessonRepository.create).toHaveBeenCalledWith(specialDto);
    });

    it('should handle very long lesson title', async () => {
      const longTitle = 'a'.repeat(1000);
      const longTitleDto = {
        title: longTitle,
        blocks: [],
        courseId: '507f1f77bcf86cd799439011'
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      lessonRepository.create.mockResolvedValue({});

      await lessonService.createLesson(longTitleDto);

      expect(lessonRepository.create).toHaveBeenCalledWith(longTitleDto);
    });

    it('should handle blocks with complex nested objects', async () => {
      const complexDto = {
        title: 'Complex Lesson',
        blocks: [
          {
            type: 'quiz',
            questions: [
              { 
                question: 'What is 2+2?', 
                answers: ['3', '4', '5'], 
                correct: 1,
                metadata: { difficulty: 'easy', category: 'math' }
              }
            ]
          }
        ],
        courseId: '507f1f77bcf86cd799439011'
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      uuidv4.mockReturnValue('complex-uuid');
      lessonRepository.create.mockResolvedValue({});

      await lessonService.createLesson(complexDto);

      expect(lessonRepository.create).toHaveBeenCalledWith({
        title: complexDto.title,
        blocks: [
          {
            id: 'complex-uuid',
            type: 'quiz',
            questions: [
              { 
                question: 'What is 2+2?', 
                answers: ['3', '4', '5'], 
                correct: 1,
                metadata: { difficulty: 'easy', category: 'math' }
              }
            ]
          }
        ],
        courseId: complexDto.courseId
      });
    });
  });
});