const courseRepository = require('../repositories/courseRepository');
const CourseBuilder = require('../builders/CourseBuilder');

class CourseService {
    async createCourse(dto, teacherId) {
        if (!dto.title || !dto.description) {
            const err = new Error('title та description — обовʼязкові');
            err.statusCode = 400;
            throw err;
        }
        const builder = new CourseBuilder()
            .setTitle(dto.title)
            .setDescription(dto.description)
            .setTeacher(teacherId);

        ; (dto.lessons || []).forEach(id => builder.addLesson(id));
        ; (dto.modules || []).forEach(id => builder.addModule(id));
        if (dto.published) builder.setPublished(true);

        const courseData = builder.build();
        return courseRepository.create(courseData);
    }

    async getAllCourses() {
        return courseRepository.findAllPublished();
    }

    async getCourseById(id) {
        const course = await courseRepository.findById(id);
        if (!course) {
            const err = new Error('Курс не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return course;
    }

    async updateCourse(id, dto, teacherId) {
        if (dto.title === '' || dto.description === '') {
            const err = new Error('title та description не можуть бути порожніми');
            err.statusCode = 400;
            throw err;
        }

        const updateData = {
            ...dto
        };
        if ('published' in dto && typeof dto.published !== 'boolean') {
            const err = new Error('published має бути булевим');
            err.statusCode = 400;
            throw err;
        }

        const updated = await courseRepository.updateById(id, updateData);
        if (!updated) {
            const err = new Error('Курс не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return updated;
    }

    async deleteCourse(id) {
        const deleted = await courseRepository.deleteById(id);
        if (!deleted) {
            const err = new Error('Курс не знайдено');
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    }
}

module.exports = new CourseService();
