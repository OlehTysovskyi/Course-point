const courseService = require('../../services/courseService');
const courseRepository = require('../../repositories/courseRepository');
const { v4: uuidv4 } = require('uuid');
const CourseBuilder = require('../../builders/CourseBuilder');

jest.mock('../../repositories/courseRepository');
jest.mock('uuid');
jest.mock('../../builders/CourseBuilder');

describe('CourseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course successfully', async () => {
      const courseData = {
        title: 'Test Course',
        description: 'Test Description',
        lessons: [],
        modules: [],
        published: false
      };
      const teacherId = 'teacher123';
      const builtCourse = { ...courseData, teacher: teacherId };
      const mockCourse = { id: 'course123', ...builtCourse };
      // Mock CourseBuilder chain
      const builderInstance = {
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setTeacher: jest.fn().mockReturnThis(),
        addLesson: jest.fn().mockReturnThis(),
        addModule: jest.fn().mockReturnThis(),
        setPublished: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue(builtCourse)
      };
      CourseBuilder.mockImplementation(() => builderInstance);
      courseRepository.create.mockResolvedValue(mockCourse);

      const result = await courseService.createCourse(courseData, teacherId);

      expect(CourseBuilder).toHaveBeenCalled();
      expect(builderInstance.setTitle).toHaveBeenCalledWith(courseData.title);
      expect(builderInstance.setDescription).toHaveBeenCalledWith(courseData.description);
      expect(builderInstance.setTeacher).toHaveBeenCalledWith(teacherId);
      expect(courseRepository.create).toHaveBeenCalledWith(builtCourse);
      expect(result).toEqual(mockCourse);
    });

    it('should throw error if title is missing', async () => {
      const courseData = {
        description: 'Test Description',
        lessons: [],
        modules: []
      };
      const teacherId = 'teacher123';
      await expect(courseService.createCourse(courseData, teacherId))
        .rejects.toThrow('title та description — обовʼязкові');
    });
  });

  describe('getAllCourses', () => {
    it('should return all courses', async () => {
      const mockCourses = [
        { id: 'course1', title: 'Course 1' },
        { id: 'course2', title: 'Course 2' }
      ];
      courseRepository.findAll.mockResolvedValue(mockCourses);

      const result = await courseService.getAllCoursesAdmin();

      expect(courseRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCourses);
    });
  });

  describe('getCourseById', () => {
    it('should return course by id', async () => {
      const courseId = 'course123';
      const mockCourse = {
        id: courseId,
        title: 'Test Course',
        description: 'Test Description'
      };

      courseRepository.findById.mockImplementation(() => Promise.resolve(mockCourse));

      const result = await courseService.getCourseById(courseId);

      expect(courseRepository.findById).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockCourse);
    });

    it('should throw error if course not found', async () => {
      const courseId = 'nonexistent';

      courseRepository.findById.mockImplementation(() => Promise.resolve(null));

      await expect(courseService.getCourseById(courseId))
        .rejects.toThrow('Курс не знайдено');
    });
  });

  describe('updateCourse', () => {
    it('should update course successfully', async () => {
      const courseId = 'course123';
      const updateData = { title: 'Updated Course', description: 'Updated Description' };
      const teacherId = 'teacher123';
      const mockCourse = { id: courseId, ...updateData };
      courseRepository.updateById.mockResolvedValue(mockCourse);

      const result = await courseService.updateCourse(courseId, updateData, teacherId);

      expect(courseRepository.updateById).toHaveBeenCalledWith(courseId, updateData);
      expect(result).toEqual(mockCourse);
    });

    it('should throw error if course not found', async () => {
      const courseId = 'nonexistent';
      const updateData = { title: 'Updated Course' };
      const teacherId = 'teacher123';
      courseRepository.updateById.mockResolvedValue(null);

      await expect(courseService.updateCourse(courseId, updateData, teacherId))
        .rejects.toThrow('Курс не знайдено');
    });
  });

  describe('deleteCourse', () => {
    it('should delete course successfully', async () => {
      const courseId = 'course123';
      courseRepository.deleteById.mockResolvedValue(true);

      const result = await courseService.deleteCourse(courseId);

      expect(courseRepository.deleteById).toHaveBeenCalledWith(courseId);
      expect(result).toBe(true);
    });

    it('should throw error if course not found', async () => {
      const courseId = 'nonexistent';
      courseRepository.deleteById.mockResolvedValue(null);

      await expect(courseService.deleteCourse(courseId))
        .rejects.toThrow('Курс не знайдено');
    });
  });
}); 