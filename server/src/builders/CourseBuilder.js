class CourseBuilder {
    constructor() {
        this.course = {
            lessons: [],
            modules: [],
            published: false
        };
    }

    setTitle(title) {
        this.course.title = title;
        return this;
    }

    setDescription(desc) {
        this.course.description = desc;
        return this;
    }

    setTeacher(teacherId) {
        this.course.teacher = teacherId;
        return this;
    }

    addLesson(lessonId) {
        this.course.lessons.push(lessonId);
        return this;
    }

    addModule(moduleId) {
        this.course.modules.push(moduleId);
        return this;
    }

    setPublished(published = true) {
        this.course.published = published;
        return this;
    }

    build() {
        const { title, description, teacher } = this.course;
        if (!title || !description || !teacher) {
            throw new Error('Course must have title, description and teacher');
        }
        return this.course;
    }
}

module.exports = CourseBuilder;
