import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Course, getAllPublishedCourses } from "../../../services/courseService";
import { SearchBar } from "../../../components/ui/SearchBar";
import { Button } from "../../../components/ui/Button";
import { BackButton } from "../../../components/ui/BackButton";

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllPublishedCourses();
        setCourses(data);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError("Не вдалося завантажити курси.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.teacher.name.toLowerCase().includes(query)
    );
  });

  if (loading)
    return (
      <div className="p-6 text-center text-blue-600 text-lg">Завантаження курсів...</div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600 text-lg">{error}</div>
    );
  if (courses.length === 0)
    return (
      <div className="p-6 text-center text-gray-600 text-lg">Публічних курсів поки немає.</div>
    );

  return (
    <section>
      <div className="max-w-7xl mb-8 mx-auto py-8 px-6">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-800">
          Всі публічні курси
        </h1>

        <div className="max-w-xl mx-auto mb-12">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Пошук за назвою, описом або викладачем"
            className="shadow-lg rounded-lg"
          />
        </div>

        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Курси за вашим запитом не знайдені.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <li
                key={course._id}
                onClick={() => navigate(`/view-course/${course._id}`)}
                className="cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.04] transition-transform duration-300 flex flex-col p-6"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/view-course/${course._id}`);
                  }
                }}
                role="button"
                aria-label={`Переглянути курс ${course.title}`}
              >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">{course.title}</h2>
                <p className="flex-grow text-gray-700 mb-6 line-clamp-4">{course.description}</p>
                <p className="text-sm text-gray-500 italic mb-6">Викладач: {course.teacher.name}</p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/view-course/${course._id}`);
                  }}
                  className="self-start bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                >
                  Переглянути
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-16 text-center">
        <BackButton />
      </div>
    </section>
  );
}
