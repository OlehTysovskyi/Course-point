import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../../services/courseService";
import { getLessonsByCourseId, Lesson } from "../../../services/lessonService";
import { getModulesByCourseId, Module } from "../../../services/moduleService";
import { BackButton } from "../../../components/ui/BackButton";

export default function EditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<{ title: string; description: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        const lessonsData = await getLessonsByCourseId(courseId);
        setLessons(lessonsData);

        const modulesData = await getModulesByCourseId(courseId);
        setModules(modulesData);
      } catch {
        setError("Помилка завантаження курсу");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const combinedContent = () => {
    const modulesByLastLessonId: Record<string, Module[]> = {};
    modules.forEach((mod) => {
      const lastId = mod.lessons?.[mod.lessons.length - 1];
      if (lastId) {
        modulesByLastLessonId[lastId] = [...(modulesByLastLessonId[lastId] || []), mod];
      }
    });

    const combined: Array<{ type: "lesson" | "module"; data: Lesson | Module }> = [];
    lessons.forEach((lesson) => {
      combined.push({ type: "lesson", data: lesson });
      (modulesByLastLessonId[lesson._id] || []).forEach(mod =>
        combined.push({ type: "module", data: mod })
      );
    });

    return combined;
  };

  if (loading) return <div className="text-center text-blue-600 text-lg">Завантаження...</div>;
  if (error) return <div className="text-red-600 text-center font-semibold">{error}</div>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      {course && (
        <>
          <h1 className="text-3xl font-bold text-indigo-800 mb-2 text-center">
            Редагування курсу
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg italic">{course.title}</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
            <button
              onClick={() => navigate(`/teacher/create-lesson/${courseId}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md"
            >
              ➕ Додати урок
            </button>
            <button
              onClick={() => navigate(`/teacher/create-module/${courseId}?graded=false`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md"
            >
              ➕ Неоцінювальний модуль
            </button>
            <button
              onClick={() => navigate(`/teacher/create-module/${courseId}?graded=true`)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md"
            >
              ➕ Оцінювальний модуль
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Зміст курсу</h2>
            {lessons.length + modules.length > 0 ? (
              <ul className="space-y-3">
                {combinedContent().map((item) => {
                  if (item.type === "lesson") {
                    const lesson = item.data as Lesson;
                    return (
                      <li
                        key={"lesson-" + lesson._id}
                        className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
                        onClick={() => navigate(`/teacher/edit-lesson/${lesson._id}`)}
                      >
                        📘 <span className="font-medium">{lesson.title}</span>
                      </li>
                    );
                  } else {
                    const mod = item.data as Module;
                    return (
                      <li
                        key={"module-" + mod._id}
                        className="ml-4 bg-blue-50 p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
                        onClick={() => navigate(`/teacher/edit-module/${mod._id}`)}
                      >
                        📚 <span className="font-medium">{mod.title}</span>{" "}
                        <span className="text-sm italic">
                          ({mod.graded ? "оцінювальний" : "неоцінювальний"})
                        </span>
                      </li>
                    );
                  }
                })}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Поки що немає уроків або модулів.</p>
            )}
          </div>
        </>
      )}

      <div className="mt-10 text-center">
        <BackButton />
      </div>
    </section>
  );
}
