import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../../services/courseService";
import { getLessonsByCourseId, Lesson } from "../../../services/lessonService";
import { getModulesByCourseId, Module } from "../../../services/moduleService";

export default function CourseViewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<{ title: string; description: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourseAndContent = async () => {
      if (courseId) {
        setLoading(true);
        try {
          const course = await getCourseById(courseId);
          setCourse(course);

          const lessons = await getLessonsByCourseId(courseId);
          setLessons(lessons);

          const mods = await getModulesByCourseId(courseId);
          setModules(mods);
        } catch (err) {
          console.error("Помилка завантаження:", err);
          setError("Не вдалося завантажити курс або вміст.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseAndContent();
  }, [courseId]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Завантаження...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto py-8 px-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {course && (
        <>
          <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
          <p className="mb-6">{course.description}</p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Уроки курсу:</h2>
            {lessons.length > 0 ? (
              <ul className="space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <span>{lesson.title}</span>
                    <button
                      onClick={() => navigate(`/view-lesson/${lesson._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      👁 Переглянути
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Уроків поки немає.</p>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Модулі курсу:</h2>
            {modules.length > 0 ? (
              <ul className="space-y-2">
                {modules.map((mod) => (
                  <li key={mod._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <span>
                      {mod.title} {mod.graded ? "(оцінювальний)" : "(неоцінювальний)"}
                    </span>
                    <button
                      onClick={() => navigate(`/view-module/${mod._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      👁 Переглянути
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Модулів поки немає.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
