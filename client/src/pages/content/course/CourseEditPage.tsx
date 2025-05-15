import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "../../../services/courseService";
import { getLessonsByCourseId, Lesson } from "../../../services/lessonService";
import { getModulesByCourseId, Module } from "../../../services/moduleService";

export default function EditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCourseData = async (id: string) => {
    try {
      const course = await getCourseById(id);
      setTitle(course.title);
      setDescription(course.description);

      const lessons = await getLessonsByCourseId(id);
      setLessons(lessons);

      const mods = await getModulesByCourseId(id);
      setModules(mods);
    } catch (err) {
      console.error("Помилка завантаження курсу:", err);
      setMessage("Не вдалося завантажити курс.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourseData(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;

    const handler = setTimeout(() => {
      updateCourse(courseId, { title, description })
        .then(() => setMessage("Зміни збережено"))
        .catch(() => setMessage("Помилка збереження"));
    }, 1000);

    return () => clearTimeout(handler);
  }, [title, description, courseId]);

  const handleCreateModule = (graded: boolean) => {
    if (!courseId) return;
    navigate(`/teacher/create-module/new/${courseId}?graded=${graded}`);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-8 px-4">Завантаження...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Редагування курсу</h1>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Назва курсу</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-4"
          placeholder="Введіть назву курсу"
        />
        <label className="block mb-1 font-medium">Опис курсу</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Введіть опис курсу"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate(`/teacher/create-lesson/${courseId}`)}
          className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          ➕ Додати урок
        </button>
        <button
          onClick={() => navigate(`/teacher/create-module/${courseId}`)}
          className="px-4 py-2 rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
        >
          ➕ Неоцінювальний модуль
        </button>
        <button
          onClick={() => navigate(`/teacher/create-module/${courseId}`)}
          className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          ➕ Оцінювальний модуль
        </button>
      </div>

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Уроки курсу:</h2>
        {lessons.length > 0 ? (
          <ul className="space-y-2">
            {lessons.map(lesson => (
              <li key={lesson._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                <span>{lesson.title}</span>
                <button
                  onClick={() => navigate(`/teacher/edit-lesson/${lesson._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Редагувати
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
            {modules.map(mod => (
              <li key={mod._id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                <span>{mod.title} {mod.graded ? "(оцінювальний)" : "(неоцінювальний)"}</span>
                <button
                  onClick={() => navigate(`/teacher/edit-module/${mod._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Редагувати
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Модулів поки немає.</p>
        )}
      </div>
    </div>
  );
}
