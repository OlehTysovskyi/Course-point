import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../../services/courseService";
import { getLessonsByCourseId, Lesson } from "../../../services/lessonService";
import { getModulesByCourseId, Module } from "../../../services/moduleService";

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
      } catch (e) {
        setError("Помилка завантаження курсу");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  // Формуємо комбінований список: після уроку додаємо всі модулі, де цей урок — останній в списку lessons
  const combinedContent = () => {
    const modulesByLastLessonId: Record<string, Module[]> = {};
    modules.forEach((mod) => {
      if (mod.lessons && mod.lessons.length > 0) {
        const lastLessonId = mod.lessons[mod.lessons.length - 1];
        if (!modulesByLastLessonId[lastLessonId]) {
          modulesByLastLessonId[lastLessonId] = [];
        }
        modulesByLastLessonId[lastLessonId].push(mod);
      }
    });

    const combined: Array<{ type: "lesson" | "module"; data: Lesson | Module }> = [];
    lessons.forEach((lesson) => {
      combined.push({ type: "lesson", data: lesson });
      const modsAfterLesson = modulesByLastLessonId[lesson._id];
      if (modsAfterLesson) {
        modsAfterLesson.forEach((mod) => combined.push({ type: "module", data: mod }));
      }
    });

    return combined;
  };

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {course && (
        <>
          <h1 className="text-3xl font-bold mb-6">Редагування курсу: {course.title}</h1>
          <p className="mb-6">{course.description}</p>

          <div>
            <h2 className="text-xl font-semibold mb-4">Уроки та модулі курсу</h2>
            {lessons.length + modules.length > 0 ? (
              <ul className="space-y-2">
                {combinedContent().map((item) => {
                  if (item.type === "lesson") {
                    const lesson = item.data as Lesson;
                    return (
                      <li
                        key={"lesson-" + lesson._id}
                        className="bg-gray-100 p-3 rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => navigate(`/teacher/edit-lesson/${lesson._id}`)}
                      >
                        📘 {lesson.title}
                      </li>
                    );
                  } else {
                    const mod = item.data as Module;
                    return (
                      <li
                        key={"module-" + mod._id}
                        className="bg-blue-100 p-3 rounded-md cursor-pointer hover:bg-blue-200 ml-6"
                        onClick={() => navigate(`/teacher/edit-module/${mod._id}`)}
                      >
                        📚 {mod.title} {mod.graded ? "(оцінювальний)" : "(неоцінювальний)"}
                      </li>
                    );
                  }
                })}
              </ul>
            ) : (
              <p>Уроків та модулів поки немає.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
