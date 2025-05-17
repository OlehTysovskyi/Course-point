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

  const [progress, setProgress] = useState<{ grade: number } | null>(null);
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

          const fetchedProgress = await getProgressByCourse(courseId);
          setProgress(fetchedProgress);
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
      setProgress({ grade: 0 });
    } catch (err) {
      console.error("Помилка створення прогресу:", err);
      setCreateProgressError("Не вдалося почати курс. Спробуйте пізніше.");
    } finally {
      setCreatingProgress(false);
    }
  };

  const combinedContent = () => {
    if (lessons.length === 0) return [];

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

          {!progress ? (
            <button
              onClick={handleStartCourse}
              disabled={creatingProgress}
              className="mb-6 px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {creatingProgress ? "Починаємо курс..." : "Почати курс"}
            </button>
          ) : (
            <p className="mb-6 text-green-700 font-semibold">
              Ви вже на курсі. Оцінка: {progress.grade} / 100
            </p>
          )}

          {createProgressError && <p className="text-red-600 mb-6">{createProgressError}</p>}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Вміст курсу:</h2>
            {lessons.length + modules.length > 0 ? (
              <ul className="space-y-2">
                {combinedContent().map((item) => {
                  if (item.type === "lesson") {
                    const lesson = item.data as Lesson;
                    return (
                      <li
                        key={"lesson-" + lesson._id}
                        className={`bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition cursor-pointer ${
                          !progress ? "opacity-50 pointer-events-none" : ""
                        }`}
                        onClick={() => progress && navigate(`/view-lesson/${lesson._id}`)}
                        title={!progress ? "Спочатку почніть курс" : ""}
                      >
                        📘 {lesson.title}
                      </li>
                    );
                  } else {
                    const mod = item.data as Module;
                    return (
                      <li
                        key={"module-" + mod._id}
                        className={`bg-blue-100 p-3 rounded-md hover:bg-blue-200 transition cursor-pointer ${
                          !progress ? "opacity-50 pointer-events-none" : ""
                        }`}
                        onClick={() => progress && navigate(`/view-module/${courseId}/${mod._id}`)}
                        title={!progress ? "Спочатку почніть курс" : ""}
                      >
                        📚 {mod.title} {mod.graded ? "(оцінювальний)" : "(неоцінювальний)"}
                      </li>
                    );
                  }
                })}
              </ul>
            ) : (
              <p>Вмісту поки немає.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
