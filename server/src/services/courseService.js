const Course = require('../models/Course');
const CourseBuilder = require('../builders/CourseBuilder');

exports.create = async (data, teacherId) => {
    const builder = new CourseBuilder()
        .setTitle(data.title)
        .setDescription(data.description)
        .setTeacher(teacherId);
    data.lessons.forEach(l => builder.addLesson(l));
    data.modules.forEach(m => builder.addModule(m));
    const course = builder.build();
    return Course.create(course);
};

exports.getAll = () => Course.find({ published: true }).populate('teacher');