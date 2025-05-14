import { useState, useEffect } from "react";
import { getAllPublishedCourses, Course } from "../../services/courseService";

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const courses = await getAllPublishedCourses();
        setAllCourses(courses);
      } catch (err) {
        setError("Не вдалося завантажити курси. Спробуйте ще раз.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Мої курси</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Пошук курсу"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full border rounded p-2 bg-white"
        />
      </div>

      {loading && <p>Завантаження курсів...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <h2 className="text-xl font-semibold mb-2">Мої курси</h2>
        <ul className="space-y-4">
          {myCourses.length === 0 ? (
            <p>У вас немає курсів.</p>
          ) : (
            myCourses.map(course => (
              <li key={course._id} className="border p-4 rounded shadow bg-white">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p>{course.description}</p>
                <p className="text-sm text-gray-500">Викладач: {course.teacher.name}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Всі доступні курси</h2>
        <ul className="space-y-4">
          {filteredCourses.map(course => (
            <li key={course._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="text-sm text-gray-500">Викладач: {course.teacher.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
