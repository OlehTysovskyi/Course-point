const moduleService = require('../../services/moduleService');
const moduleRepository = require('../../repositories/ModuleRepository');

// Мокування залежностей
jest.mock('../../repositories/moduleRepository');

describe('ModuleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createModule', () => {
    it('повинен створити модуль з правильними даними', async () => {
      // Підготовка
      const moduleDto = {
        title: 'Test Module',
        course: 'course123',
        lessons: ['lesson1', 'lesson2'],
        graded: true,
        grade: 100,
        questions: [{ text: 'Question 1', options: [], correctAnswers: [] }]
      };

      const expectedModule = {
        id: 'module123',
        ...moduleDto
      };

      moduleRepository.create.mockResolvedValue(expectedModule);

      // Виконання
      const result = await moduleService.createModule(moduleDto);

      // Перевірка
      expect(moduleRepository.create).toHaveBeenCalledWith(moduleDto);
      expect(result).toEqual(expectedModule);
    });

    it('повинен викинути помилку, якщо відсутній course', async () => {
      // Підготовка
      const moduleDto = {
        title: 'Test Module',
        // відсутній course
        lessons: ['lesson1'],
        graded: false
      };

      // Виконання і Перевірка
      await expect(moduleService.createModule(moduleDto))
        .rejects.toThrow('Поле course (ID курсу) є обов' + "’" + 'язковим');

      expect(moduleRepository.create).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо відсутній title', async () => {
      // Підготовка
      const moduleDto = {
        // відсутній title
        course: 'course123',
        lessons: ['lesson1'],
        graded: false
      };

      // Виконання і Перевірка
      await expect(moduleService.createModule(moduleDto))
        .rejects.toThrow('Поле title є обов' + "’" + 'язковим');

      expect(moduleRepository.create).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо graded не є булевим', async () => {
      // Підготовка
      const moduleDto = {
        title: 'Test Module',
        course: 'course123',
        lessons: ['lesson1'],
        graded: 'true' // рядок замість булевого
      };

      // Виконання і Перевірка
      await expect(moduleService.createModule(moduleDto))
        .rejects.toThrow('Поле graded має бути булевим');

      expect(moduleRepository.create).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо модуль оцінюваний, але відсутня оцінка', async () => {
      // Підготовка
      const moduleDto = {
        title: 'Test Module',
        course: 'course123',
        lessons: ['lesson1'],
        graded: true,
        // відсутній grade
        questions: []
      };

      // Виконання і Перевірка
      await expect(moduleService.createModule(moduleDto))
        .rejects.toThrow('Поле grade обовʼязкове для оцінювального модуля і має бути додатнім числом');

      expect(moduleRepository.create).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо grade не є додатнім числом', async () => {
      // Підготовка
      const moduleDto = {
        title: 'Test Module',
        course: 'course123',
        lessons: ['lesson1'],
        graded: true,
        grade: -10, // відʼємне число
        questions: []
      };

      // Виконання і Перевірка
      await expect(moduleService.createModule(moduleDto))
        .rejects.toThrow('Поле grade обовʼязкове для оцінювального модуля і має бути додатнім числом');

      expect(moduleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllModules', () => {
    it('повинен повернути всі модулі', async () => {
      // Підготовка
      const expectedModules = [
        { id: 'module1', title: 'Module 1' },
        { id: 'module2', title: 'Module 2' }
      ];

      moduleRepository.findAll.mockResolvedValue(expectedModules);

      // Виконання
      const result = await moduleService.getAllModules();

      // Перевірка
      expect(moduleRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedModules);
    });
  });

  describe('getModuleById', () => {
    it('повинен повернути модуль за ID', async () => {
      // Підготовка
      const moduleId = 'module123';
      const expectedModule = { id: moduleId, title: 'Test Module' };

      moduleRepository.findById.mockResolvedValue(expectedModule);

      // Виконання
      const result = await moduleService.getModuleById(moduleId);

      // Перевірка
      expect(moduleRepository.findById).toHaveBeenCalledWith(moduleId);
      expect(result).toEqual(expectedModule);
    });

    it('повинен викинути помилку 404, якщо модуль не знайдено', async () => {
      // Підготовка
      const moduleId = 'nonexistent';

      moduleRepository.findById.mockResolvedValue(null);

      // Виконання і Перевірка
      await expect(moduleService.getModuleById(moduleId))
        .rejects.toThrow('Модуль не знайдено');

      expect(moduleRepository.findById).toHaveBeenCalledWith(moduleId);
    });
  });

  describe('getModulesByCourseId', () => {
    it('повинен повернути модулі за ID курсу', async () => {
      // Підготовка
      const courseId = 'course123';
      const expectedModules = [
        { id: 'module1', title: 'Module 1', course: courseId },
        { id: 'module2', title: 'Module 2', course: courseId }
      ];

      moduleRepository.findByCourseId.mockResolvedValue(expectedModules);

      // Виконання
      const result = await moduleService.getModulesByCourseId(courseId);

      // Перевірка
      expect(moduleRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(expectedModules);
    });
  });

  describe('updateModule', () => {
    it('повинен оновити модуль та повернути оновлені дані', async () => {
      // Підготовка
      const moduleId = 'module123';
      const updateDto = {
        title: 'Updated Title',
        lessons: ['lesson3', 'lesson4'],
        graded: false,
        questions: []
      };

      const updatedModule = {
        id: moduleId,
        ...updateDto,
        course: 'course123'
      };

      moduleRepository.updateById.mockResolvedValue(updatedModule);

      // Виконання
      const result = await moduleService.updateModule(moduleId, updateDto);

      // Перевірка
      expect(moduleRepository.updateById).toHaveBeenCalledWith(moduleId, updateDto);
      expect(result).toEqual(updatedModule);
    });

    it('повинен викинути помилку, якщо title не є рядком', async () => {
      // Підготовка
      const moduleId = 'module123';
      const updateDto = {
        title: 123, // число замість рядка
      };

      // Виконання і Перевірка
      await expect(moduleService.updateModule(moduleId, updateDto))
        .rejects.toThrow('title має бути рядком');

      expect(moduleRepository.updateById).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо lessons не є масивом', async () => {
      // Підготовка
      const moduleId = 'module123';
      const updateDto = {
        lessons: 'not an array'
      };

      // Виконання і Перевірка
      await expect(moduleService.updateModule(moduleId, updateDto))
        .rejects.toThrow('lessons має бути масивом');

      expect(moduleRepository.updateById).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо graded не є булевим', async () => {
      // Підготовка
      const moduleId = 'module123';
      const updateDto = {
        graded: 'false' // рядок замість булевого
      };

      // Виконання і Перевірка
      await expect(moduleService.updateModule(moduleId, updateDto))
        .rejects.toThrow('graded має бути boolean');

      expect(moduleRepository.updateById).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку, якщо questions не є масивом', async () => {
      // Підготовка
      const moduleId = 'module123';
      const updateDto = {
        questions: 'not an array'
      };

      // Виконання і Перевірка
      await expect(moduleService.updateModule(moduleId, updateDto))
        .rejects.toThrow('questions має бути масивом');

      expect(moduleRepository.updateById).not.toHaveBeenCalled();
    });

    it('повинен викинути помилку 404, якщо модуль не знайдено', async () => {
      // Підготовка
      const moduleId = 'nonexistent';
      const updateDto = {
        title: 'Updated Title'
      };

      moduleRepository.updateById.mockResolvedValue(null);

      // Виконання і Перевірка
      await expect(moduleService.updateModule(moduleId, updateDto))
        .rejects.toThrow('Модуль не знайдено');

      expect(moduleRepository.updateById).toHaveBeenCalledWith(moduleId, { title: 'Updated Title' });
    });
  });

  describe('deleteModule', () => {
    it('повинен видалити модуль та повернути видалені дані', async () => {
      // Підготовка
      const moduleId = 'module123';
      const deletedModule = {
        id: moduleId,
        title: 'Deleted Module'
      };

      moduleRepository.deleteById.mockResolvedValue(deletedModule);

      // Виконання
      const result = await moduleService.deleteModule(moduleId);

      // Перевірка
      expect(moduleRepository.deleteById).toHaveBeenCalledWith(moduleId);
      expect(result).toEqual(deletedModule);
    });

    it('повинен викинути помилку 404, якщо модуль не знайдено', async () => {
      // Підготовка
      const moduleId = 'nonexistent';

      moduleRepository.deleteById.mockResolvedValue(null);

      // Виконання і Перевірка
      await expect(moduleService.deleteModule(moduleId))
        .rejects.toThrow('Модуль не знайдено');

      expect(moduleRepository.deleteById).toHaveBeenCalledWith(moduleId);
    });
  });
});