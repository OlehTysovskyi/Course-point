import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoursesByTeacher, Course } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

export default function TeacherPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      getAllCoursesByTeacher(user.id)
        .then(setCourses)
        .catch(console.error);
    }
  }, [user?.id]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Мої курси</h1>
        <button
          onClick={() => navigate(`/teacher/edit-course/new`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Створити курс
        </button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-700">{course.description}</p>
            <button
              onClick={() => navigate(`/teacher/edit-course/${course._id}`)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              ✏️ Редагувати
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}