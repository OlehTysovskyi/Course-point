import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../../services/courseService";
import { getLessonsByCourseId, Lesson } from "../../../services/lessonService";
import { getModulesByCourseId, Module } from "../../../services/moduleService";
import { enrollToCourse, getProgressByCourse } from "../../../services/progresService";

export default function CourseViewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<{ title: string; description: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [progressCreated, setProgressCreated] = useState(false);
  const [creatingProgress, setCreatingProgress] = useState(false);
  const [createProgressError, setCreateProgressError] = useState<string | null>(null);

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

          const progress = await getProgressByCourse(courseId);
          setProgressCreated(progress !== null);
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

  const handleStartCourse = async () => {
    if (!courseId) return;
    setCreatingProgress(true);
    setCreateProgressError(null);
    try {
      await enrollToCourse(courseId);
      setProgressCreated(true);
    } catch (err) {
      console.error("Помилка створення прогресу:", err);
      setCreateProgressError("Не вдалося почати курс. Спробуйте пізніше.");
    } finally {
      setCreatingProgress(false);
    }
  };

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

          {!progressCreated ? (
            <button
              onClick={handleStartCourse}
              disabled={creatingProgress}
              className="mb-6 px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {creatingProgress ? "Починаємо курс..." : "Почати курс"}
            </button>
          ) : (
            <p className="mb-6 text-green-700 font-semibold">Курс розпочато!</p>
          )}

          {createProgressError && <p className="text-red-600 mb-6">{createProgressError}</p>}

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
                      onClick={() => navigate(`/view-module/${courseId}/${mod._id}`)}
                      className={`text-blue-600 hover:underline ${!progressCreated ? "pointer-events-none opacity-50" : ""}`}
                      title={!progressCreated ? "Спочатку почніть курс" : ""}
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
