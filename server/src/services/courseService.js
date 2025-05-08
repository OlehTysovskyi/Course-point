const Course = require('../models/Course');
const CourseBuilder = require('../builders/CourseBuilder');

exports.create = async (data, teacherId) => {
    // будуємо об'єкт курсу
    const builder = new CourseBuilder()
        .setTitle(data.title)
        .setDescription(data.description)
        .setTeacher(teacherId);

    // на етапі створення може бути пустий масив lessons/modules
    (data.lessons || []).forEach(l => builder.addLesson(l));
    (data.modules || []).forEach(m => builder.addModule(m));

    // за бажанням відразу публікувати
    if (data.published) builder.setPublished(true);

    const courseData = builder.build();
    return Course.create(courseData);
};

exports.getAll = async () => {
    return Course.find({ published: true })
        .populate('teacher', 'name email')
        .populate('lessons')
        .populate('modules');
};

exports.getById = async (id) => {
    return Course.findById(id)
        .populate('teacher', 'name email')
        .populate('lessons')
        .populate('modules');
};
