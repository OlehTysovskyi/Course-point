import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Course, getAllPublishedCourses } from "../../../services/courseService";
import { SearchBar } from "../../../components/ui/SearchBar";

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.teacher.name.toLowerCase().includes(query)
    );
  });

  if (loading) return <div className="p-6">Завантаження курсів...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  if (courses.length === 0)
    return <div className="p-6">Публічних курсів поки немає.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Всі публічні курси</h1>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Пошук за назвою, описом або викладачем"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <p>Курси за вашим запитом не знайдені.</p>
      ) : (
        <ul className="space-y-4">
          {filteredCourses.map((course) => (
            <li
              key={course._id}
              onClick={() => navigate(`/view-course/${course._id}`)}
              className="cursor-pointer p-4 border rounded hover:bg-gray-100 transition"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-700">{course.description}</p>
              <p className="text-sm text-gray-500">Викладач: {course.teacher.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
