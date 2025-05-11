// server/src/services/courseService.js

const courseRepository = require('../repositories/courseRepository');
const CourseBuilder = require('../builders/CourseBuilder');

class CourseService {
    /**
     * Створити новий курс (перевірки + Builder → Repository)
     * @param {Object} dto — { title, description, lessons, modules, published }
     * @param {string} teacherId
     */
    async createCourse(dto, teacherId) {
        // 1. Валідація обовʼязкових полів
        if (!dto.title || !dto.description) {
            const err = new Error('title та description — обовʼязкові');
            err.statusCode = 400;
            throw err;
        }

        // 2. Збір обʼєкта через Builder
        const builder = new CourseBuilder()
            .setTitle(dto.title)
            .setDescription(dto.description)
            .setTeacher(teacherId);

        // Додаємо уроки/модулі, якщо передані
        (dto.lessons || []).forEach(id => builder.addLesson(id));
        (dto.modules || []).forEach(id => builder.addModule(id));

        if (dto.published) builder.setPublished(true);

        const courseData = builder.build();

        // 3. Створюємо через репозиторій
        return courseRepository.create(courseData);
    }

    /**
     * Повернути всі опубліковані курси
     */
    async getAllCourses() {
        return courseRepository.findAllPublished();
    }

    /**
     * Повернути курс за ID
     * @param {string} id
     */
    async getCourseById(id) {
        const course = await courseRepository.findById(id);
        if (!course) {
            const err = new Error('Курс не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return course;
    }
}

module.exports = new CourseService();
