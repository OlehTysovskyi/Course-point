import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCourse, getCourseById, updateCourse } from "../../services/courseService";
import { getAllLessons, Lesson } from "../../services/lessonService"; // 👈 підключаємо
import { v4 as uuidv4 } from "uuid";

type LessonStub = {
  id: string;
  title: string;
};

type Module = {
  id: string;
  title: string;
  graded: boolean;
};

type CourseContentItem =
  | { id: string; type: "lesson"; data: LessonStub }
  | { id: string; type: "module"; data: Module };

export default function CourseEditorPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<CourseContentItem[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (courseId && courseId !== "new") {
      getCourseById(courseId)
        .then(({ title, description }) => {
          setTitle(title);
          setDescription(description);
        })
        .catch((err) => {
          console.error("Помилка завантаження курсу:", err);
        });

      getAllLessons()
        .then((allLessons) => {
          const courseLessons = allLessons.filter(l => l.courseId === courseId);
          setLessons(courseLessons);
        })
        .catch((err) => {
          console.error("Помилка завантаження уроків:", err);
        });
    }
  }, [courseId]);

  const handleSave = async () => {
    const courseData = { title, description, content };
    try {
      if (courseId && courseId !== "new") {
        await updateCourse(courseId, courseData);
        setMessage("Курс оновлено! Тепер ви можете продовжити редагувати його.");
      } else {
        const res = await createCourse(courseData);
        setMessage(`Курс створено! Тепер ви можете редагувати його.`);
        navigate(`/teacher/edit-course/${res._id}`);
      }
    } catch (err) {
      console.error("Помилка збереження курсу:", err);
      setMessage("Сталася помилка при збереженні курсу.");
    }
  };

  const addModule = (graded: boolean) => {
    setContent((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type: "module",
        data: {
          id: uuidv4(),
          title: graded ? "Оцінювальний модуль" : "Неоцінювальний модуль",
          graded,
        },
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {courseId && courseId !== "new" ? "Редагування курсу" : "Створення нового курсу"}
      </h1>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Назва курсу</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-4"
        />
        <label className="block mb-1 font-medium">Опис курсу</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate(`/teacher/edit-lesson/new/${courseId}`)}
          className="bg-green-600 text-white px-4 py-2 rounded-md">
          ➕ Додати урок
        </button>
        <button
          onClick={() => addModule(false)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          ➕ Неоцінювальний модуль
        </button>
        <button
          onClick={() => addModule(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          ➕ Оцінювальний модуль
        </button>
      </div>

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mb-6"
      >
        💾 Зберегти курс
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Уроки курсу:</h2>
        {lessons.length > 0 ? (
          <ul className="space-y-2">
            {lessons.map((lesson) => (
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
    </div>
  );
}
