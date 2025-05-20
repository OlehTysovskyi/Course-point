import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../../services/courseService";
import { getLessonsByCourseId, Lesson } from "../../../services/lessonService";
import { getModulesByCourseId, Module } from "../../../services/moduleService";
import {
  enrollToCourse,
  getProgressByCourse,
  Progress,
} from "../../../services/progresService";
import { BackButton } from "../../../components/ui/BackButton";
import { useAuth } from "../../../context/AuthContext"; // <- імпорт контексту

export default function CourseViewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth(); // отримуємо користувача з контексту
  const isAdmin = user?.role === "admin";

  const [course, setCourse] = useState<{ title: string; description: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingProgress, setCreatingProgress] = useState(false);
  const [createProgressError, setCreateProgressError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      setLoading(true);
      setError(null);

      try {
        const [course, lessons, modules, fetchedProgress] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourseId(courseId),
          getModulesByCourseId(courseId),
          getProgressByCourse(courseId),
        ]);
        setCourse(course);
        setLessons(lessons);
        setModules(modules);
        setProgress(fetchedProgress);
      } catch (err) {
        console.error("Load error:", err);
        setError("Не вдалося завантажити курс або його вміст.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleStartCourse = async () => {
    if (!courseId) return;
    setCreatingProgress(true);
    setCreateProgressError(null);
    try {
      const created = await enrollToCourse(courseId);
      setProgress(created);
    } catch (err) {
      console.error("Enrollment error:", err);
      setCreateProgressError("Не вдалося почати курс. Спробуйте пізніше.");
    } finally {
      setCreatingProgress(false);
    }
  };

  const combinedContent = () => {
    const modulesByLesson: Record<string, Module[]> = {};
    const unlinkedModules: Module[] = [];

    modules.forEach((mod) => {
      if (mod.lessons && mod.lessons.length > 0) {
        const lastLesson = mod.lessons[mod.lessons.length - 1];
        modulesByLesson[lastLesson] = [...(modulesByLesson[lastLesson] || []), mod];
      } else {
        unlinkedModules.push(mod);
      }
    });

    const result: Array<{ type: "lesson" | "module"; data: Lesson | Module }> = [];

    lessons.forEach((lesson) => {
      result.push({ type: "lesson", data: lesson });
      const mods = modulesByLesson[lesson._id] || [];
      mods.forEach((mod) => result.push({ type: "module", data: mod }));
    });

    unlinkedModules.forEach((mod) => result.push({ type: "module", data: mod }));

    return result;
  };

  const renderProgress = () => {
    if (!progress) return null;

    const totalItems = lessons.length + modules.length;
    const completedItems =
      (progress.completedLessons?.length || 0) + (progress.passedModules?.length || 0);
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
        <h3 className="font-semibold text-green-700 text-lg mb-2">Ваш прогрес:</h3>
        <ul className="space-y-1 text-green-800 text-sm">
          <li>📘 Уроків пройдено: {progress.completedLessons.length} з {lessons.length}</li>
          <li>📚 Модулів пройдено: {progress.passedModules.length} з {modules.length}</li>
          <li>🏆 Загальна оцінка: <span className="font-bold">{progress.grade}</span> / 100</li>
        </ul>
        <div className="mt-4">
          <div className="h-3 bg-green-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-600"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-green-600 text-right">{percentage}% завершено</p>
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="p-6 text-center text-blue-600 text-lg">Завантаження курсу...</div>;

  if (error)
    return <div className="p-6 text-center text-red-600 text-lg">{error}</div>;

  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-indigo-800">{course.title}</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">{course.description}</p>

      {/* Кнопка старту курсу показується лише якщо користувач не адмін і progress ще немає */}
      {!progress && !isAdmin ? (
        <div className="text-center mb-8">
          <button
            onClick={handleStartCourse}
            disabled={creatingProgress}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
          >
            {creatingProgress ? "Починаємо курс..." : "Почати курс"}
          </button>
          {createProgressError && (
            <p className="mt-2 text-red-600">{createProgressError}</p>
          )}
        </div>
      ) : (
        renderProgress()
      )}

      <div>
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800">🧭 Навчальний шлях</h2>

        {lessons.length + modules.length === 0 ? (
          <p className="text-gray-600">Вмісту поки немає.</p>
        ) : (
          <div className="space-y-4">
            {combinedContent().map((item) => {
              const isLesson = item.type === "lesson";
              const data = item.data;
              const completed = isLesson
                ? progress?.completedLessons.includes((data as Lesson)._id)
                : progress?.passedModules.includes((data as Module)._id);

              const title = isLesson
                ? (data as Lesson).title
                : (data as Module).title;

              const subtitle = isLesson
                ? "Урок"
                : (data as Module).graded
                  ? "Модуль (оцінювальний)"
                  : "Модуль (неоцінювальний)";

              const handleClick = () => {
                // Адмін може переходити навіть без прогресу
                if (!progress && !isAdmin) return;
                if (isLesson) {
                  navigate(`/view-lesson/${courseId}/${(data as Lesson)._id}`);
                } else {
                  navigate(`/view-module/${courseId}/${(data as Module)._id}`);
                }
              };

              return (
                <div
                  key={`${item.type}-${(data as any)._id}`}
                  onClick={handleClick}
                  className={`flex items-center justify-between gap-4 border p-4 rounded-xl shadow-sm cursor-pointer transition hover:shadow-md ${!progress && !isAdmin ? "opacity-50 cursor-not-allowed" : "bg-white"
                    }`}
                  title={!progress && !isAdmin ? "Спочатку почніть курс" : ""}
                >
                  <div>
                    <p className="text-lg font-medium text-gray-800">{title}</p>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                  </div>
                  <div>
                    {completed ? (
                      <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                        ✓ Пройдено
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                        ⏳ Не завершено
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <BackButton />
      </div>
    </div>
  );
}

