import { useEffect, useState } from "react";
import { getAllPublishedCourses, Course } from "../services/courseService";
import { useNavigate } from "react-router-dom";

export default function PopularCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPublishedCourses();
      const publishedCourses = data.filter(course => course.published);
      const sortedByLessons = publishedCourses.sort(
        (a, b) => (b.lessons?.length || 0) - (a.lessons?.length || 0)
      );
      const top3 = sortedByLessons.slice(0, 6);
      setCourses(top3);
    } catch (err) {
      setError("Не вдалося завантажити курси.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-blue-200">Завантаження курсів...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (courses.length === 0) return <p className="text-center text-blue-200">Курси не знайдені.</p>;

  return (
    <section className="py-20 px-6">
      <style>
        {`
          @keyframes wiggle {
            0% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(0); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }
          .animate-wiggle {
            animation: wiggle 0.4s ease-in-out;
          }
        `}
      </style>

      <div className="relative max-w-7xl mx-auto">
        <div
          className="relative bg-white/80 rounded-3xl shadow-2xl pt-20 px-10 pb-10 overflow-hidden
                     transition-transform duration-150 ease-in-out hover:scale-[1.02]"
        >
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-full flex items-center justify-center shadow-md">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow-md">
              Популярні курси
            </h2>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={course._id}
                onClick={() => navigate(`/view-course/${course._id}`)}
                className="group cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 flex min-h-[150px] overflow-hidden"
              >
                <div className="relative w-16 flex items-center justify-center bg-cyan-400 text-white font-bold text-3xl rounded-l-3xl select-none overflow-visible z-10 group-hover:animate-wiggle">
                  #{index + 1}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: -20,
                      width: 40,
                      height: "100%",
                      backgroundColor: "#22d3ee",
                      borderRadius: "0 50% 50% 0 / 0 100% 100% 0",
                      pointerEvents: "none",
                      boxShadow: "2px 0 8px rgba(34, 211, 238, 1)",
                      zIndex: -1,
                    }}
                  />
                </div>

                <div className="p-6 ml-4 text-gray-700 flex flex-col justify-center w-[calc(100%-4rem)] max-h-[160px] overflow-hidden">
                  <h3 className="text-2xl font-semibold mb-2 text-indigo-900 truncate">
                    {course.title}
                  </h3>
                  <p className="line-clamp-3">{course.description}</p>
                  <p className="mt-4 text-sm text-gray-500">
                    Уроків: {course.lessons?.length || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}