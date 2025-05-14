import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";
import { getLessonsByCourseId } from "../../services/lessonService"; // Підключаємо метод
import { Lesson } from "../../services/lessonService";

export default function CourseViewPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<{ title: string; description: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      if (courseId) {
        setLoading(true);

        try {
          // Завантаження курсу
          const { title, description } = await getCourseById(courseId);
          setCourse({ title, description });

          // Завантаження уроків для курсу
          const courseLessons = await getLessonsByCourseId(courseId);

          // Якщо getLessonsByCourseId повертає один об'єкт, перетворіть його в масив
          setLessons(Array.isArray(courseLessons) ? courseLessons : [courseLessons]);

        } catch (err) {
          setError("Помилка завантаження курсу або уроків");
          console.error("Помилка завантаження курсу або уроків:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {error && <p className="text-red-500">{error}</p>}
      
      {loading ? (
        <p>Завантаження курсу...</p>
      ) : (
        course && (
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
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Уроків поки немає.</p>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}
