class CourseBuilder {
    constructor() { this.course = { lessons: [], modules: [] }; }
    setTitle(t) { this.course.title = t; return this; }
    setDescription(d) { this.course.description = d; return this; }
    setTeacher(id) { this.course.teacher = id; return this; }
    addLesson(lessonId) { this.course.lessons.push(lessonId); return this; }
    addModule(moduleId) { this.course.modules.push(moduleId); return this; }
    build() { return this.course; }
}
module.exports = CourseBuilder;