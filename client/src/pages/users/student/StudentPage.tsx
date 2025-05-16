import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Course, getAllUserCourses } from "../../../services/courseService";
import { SearchBar } from "../../../components/ui/SearchBar";

export default function StudentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const mine = await getAllUserCourses();
        setMyCourses(mine);
      } catch {
        setError("Не вдалося завантажити курси. Спробуйте ще раз.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = myCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Мої курси</h1>

      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Пошук за назвою, описом або викладачем"
        />
      </div>

      {loading && <p>Завантаження курсів...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <ul className="space-y-4">
          {filteredCourses.length === 0 ? (
            <p>Курси не знайдені.</p>
          ) : (
            filteredCourses.map((course) => (
              <li key={course._id} className="border p-4 rounded shadow bg-white">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p>{course.description}</p>
                <p className="text-sm text-gray-500">Викладач: {course.teacher.name}</p>
                <button
                  onClick={() => navigate(`/view-course/${course._id}`)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Переглянути
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
