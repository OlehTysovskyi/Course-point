import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoursesByTeacher, Course } from "../../../services/courseService";
import { useAuth } from "../../../context/AuthContext";
import { BackButton } from "../../../components/ui/BackButton";

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
    <section>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
          Мої курси
        </h1>

        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate(`/teacher/create-course`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition duration-300"
          >
            ➕ Створити курс
          </button>
        </div>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">У вас ще немає курсів.</p>
        ) : (
          <ul className="space-y-6">
            {courses.map((course) => (
              <li
                key={course._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 cursor-pointer"
                onClick={() => navigate(`/teacher/edit-course/${course._id}`)}
              >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-2">{course.title}</h2>
                <p className="text-gray-700 line-clamp-3">{course.description}</p>
                <p className="mt-2 text-sm text-gray-500 italic">
                  Натисніть, щоб редагувати ✏️
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16 text-center">
          <BackButton />
        </div>
      </div>
    </section>
  );
}
