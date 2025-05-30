// __tests__/services/progressService.test.js
const progressService = require('../../services/progresService');
const progressRepository = require('../../repositories/ProgressRepository');
const moduleRepository = require('../../repositories/moduleRepository');

// Мокування залежностей
jest.mock('../../repositories/ProgressRepository');
jest.mock('../../repositories/moduleRepository');

describe('ProgressService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Мокування console.log, щоб не засмічувати вивід під час тестів
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('enroll', () => {
    it('повинен повернути існуючий прогрес, якщо він уже є', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      
      const existingProgress = { 
        id: 'progress123', 
        user: userId, 
        course: courseId,
        completedLessons: [],
        passedModules: [],
        grade: 0 
      };
      
      progressRepository.findByUserAndCourse.mockImplementation(() => Promise.resolve(existingProgress));
      
      // Виконання
      const result = await progressService.enroll(userId, courseId);
      
      // Перевірка
      expect(progressRepository.findByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(progressRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingProgress);
    });

    it('повинен створити новий прогрес, якщо він не існує', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      
      progressRepository.findByUserAndCourse.mockImplementation(() => Promise.resolve(null));
      
      const newProgress = { 
        id: 'progress123', 
        user: userId, 
        course: courseId,
        completedLessons: [],
        passedModules: [],
        grade: 0 
      };
      
      progressRepository.create.mockImplementation(() => Promise.resolve(newProgress));
      
      // Виконання
      const result = await progressService.enroll(userId, courseId);
      
      // Перевірка
      expect(progressRepository.findByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(progressRepository.create).toHaveBeenCalledWith({ user: userId, course: courseId });
      expect(result).toEqual(newProgress);
    });
  });

  describe('getCoursesByUser', () => {
    it('повинен повернути курси користувача на основі прогресу', async () => {
      // Підготовка
      const userId = 'user123';
      
      const mockProgresses = [
        { course: { id: 'course1', title: 'Course 1' } },
        { course: { id: 'course2', title: 'Course 2' } }
      ];
      
      progressRepository.findByUser.mockImplementation(() => Promise.resolve(mockProgresses));
      
      // Виконання
      const result = await progressService.getCoursesByUser(userId);
      
      // Перевірка
      expect(progressRepository.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual([
        { id: 'course1', title: 'Course 1' },
        { id: 'course2', title: 'Course 2' }
      ]);
    });
  });

  describe('getProgress', () => {
    it('повинен повернути прогрес за userId та courseId', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      
      const expectedProgress = { 
        id: 'progress123', 
        user: userId, 
        course: courseId,
        completedLessons: ['lesson1'],
        passedModules: ['module1'],
        grade: 80 
      };
      
      progressRepository.findByUserAndCourse.mockImplementation(() => Promise.resolve(expectedProgress));
      
      // Виконання
      const result = await progressService.getProgress(userId, courseId);
      
      // Перевірка
      expect(progressRepository.findByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(result).toEqual(expectedProgress);
    });

    it('повинен повернути null, якщо прогрес не знайдено', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      
      progressRepository.findByUserAndCourse.mockImplementation(() => Promise.resolve(null));
      
      // Виконання
      const result = await progressService.getProgress(userId, courseId);
      
      // Перевірка
      expect(progressRepository.findByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(result).toBeNull();
    });
  });

  describe('updateProgress', () => {
    it('повинен оновити прогрес з відповідями на питання модуля', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      const moduleId = 'module123';
      
      const mockModule = {
        id: moduleId,
        grade: 10,
        questions: [
          { text: 'Q1', correctAnswers: [0, 2] },
          { text: 'Q2', correctAnswers: [1] }
        ]
      };
      
      moduleRepository.findById.mockImplementation(() => Promise.resolve(mockModule));
      
      const existingProgress = {
        id: 'progress123',
        user: userId,
        course: courseId,
        passedModules: [],
        completedLessons: ['lesson1'],
        grade: 5
      };
      
      progressRepository.findByUserAndCourse.mockImplementation(() => Promise.resolve(existingProgress));
      progressRepository.update.mockImplementation(() => Promise.resolve({
        ...existingProgress,
        passedModules: [moduleId],
        grade: 10
      }));
      
      const answersMap = {
        0: [0, 2],  // Правильна відповідь на перше питання
        1: [0]     // Неправильна відповідь на друге питання
      };
      
      // Виконання
      const result = await progressService.updateProgressForModule({
        userId,
        courseId,
        moduleId,
        answersMap
      });
      
      // Перевірка
      expect(moduleRepository.findById).toHaveBeenCalledWith(moduleId);
      expect(progressRepository.findByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(progressRepository.update).toHaveBeenCalled();
      
      // Перевіряємо, що модуль був доданий до passedModules
      expect(result.passedModules).toContain(moduleId);
      
      // Перевіряємо, що оцінка була збільшена
      expect(result.grade).toBeGreaterThanOrEqual(existingProgress.grade);
    });

    it('повинен створити новий прогрес, якщо його не існує', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      const moduleId = 'module123';
      
      const mockModule = {
        id: moduleId,
        grade: 10,
        questions: []
      };
      
      moduleRepository.findById.mockImplementation(() => Promise.resolve(mockModule));
      progressRepository.findByUserAndCourse.mockImplementation(() => Promise.resolve(null));
      
      const newProgress = {
        id: 'progress123',
        user: userId,
        course: courseId,
        passedModules: [moduleId],
        completedLessons: [],
        grade: 0
      };
      
      progressRepository.create.mockImplementation(() => Promise.resolve(newProgress));
      
      // Виконання
      await progressService.updateProgressForModule({
        userId,
        courseId,
        moduleId
      });
      
      // Перевірка
      expect(moduleRepository.findById).toHaveBeenCalledWith(moduleId);
      expect(progressRepository.findByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(progressRepository.create).toHaveBeenCalledWith({
        user: userId,
        course: courseId,
        passedModules: [],
        completedLessons: [],
        grade: 0
      });
    });

    it('повинен викинути помилку, якщо модуль не знайдено', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      const moduleId = 'nonexistent';
      
      moduleRepository.findById.mockImplementation(() => Promise.resolve(null));
      
      // Виконання і Перевірка
      await expect(progressService.updateProgressForModule({
        userId,
        courseId,
        moduleId
      })).rejects.toThrow('Module not found');
      
      expect(moduleRepository.findById).toHaveBeenCalledWith(moduleId);
      expect(progressRepository.findByUserAndCourse).not.toHaveBeenCalled();
    });
  });

  describe('unenroll', () => {
    it('повинен видалити прогрес користувача з курсу', async () => {
      // Підготовка
      const userId = 'user123';
      const courseId = 'course123';
      
      const deletedProgress = { 
        id: 'progress123', 
        user: userId, 
        course: courseId 
      };
      
      progressRepository.deleteByUserAndCourse.mockImplementation(() => Promise.resolve(deletedProgress));
      
      // Виконання
      const result = await progressService.unenroll(userId, courseId);
      
      // Перевірка
      expect(progressRepository.deleteByUserAndCourse).toHaveBeenCalledWith(userId, courseId);
      expect(result).toEqual(deletedProgress);
    });
  });
});