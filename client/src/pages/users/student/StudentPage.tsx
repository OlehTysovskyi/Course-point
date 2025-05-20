import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Course, getAllUserCourses } from "../../../services/courseService";
import { getProgressByCourse, Progress } from "../../../services/progresService";
import { SearchBar } from "../../../components/ui/SearchBar";
import { Button } from "../../../components/ui/Button";
import { BackButton } from "../../../components/ui/BackButton";

export default function StudentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const mine = await getAllUserCourses();

        const progressPromises = mine.map((course) =>
          getProgressByCourse(course._id)
            .then((progress) => ({ courseId: course._id, progress }))
            .catch(() => null)
        );

        const progressResults = await Promise.all(progressPromises);
        const progressObj: Record<string, Progress> = {};

        progressResults.forEach((res) => {
          if (res) {
            progressObj[res.courseId] = res.progress;
          }
        });

        mine.sort((a, b) => {
          const aDate = progressObj[a._id]?.createdAt ? new Date(progressObj[a._id].createdAt).getTime() : 0;
          const bDate = progressObj[b._id]?.createdAt ? new Date(progressObj[b._id].createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setMyCourses(mine);
        setProgressMap(progressObj);
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
    <section>
      <div className="max-w-7xl mb-8 mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-800">Мої курси</h1>

        <div className="mb-8 max-w-xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Пошук за назвою, описом або викладачем"
            className="shadow-lg rounded-lg"
          />
        </div>

        {loading && <p className="text-center text-blue-600 text-lg">Завантаження курсів...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

        <ul className="space-y-6">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Курси не знайдені.</p>
          ) : (
            filteredCourses.map((course) => {
              const grade = progressMap[course._id]?.grade;
              const displayGrade = grade !== undefined && grade >= 0 ? Math.round(grade) : "—";
              const gradeColor = grade !== undefined && grade >= 85 ? "from-green-400 to-green-600"
                : grade !== undefined && grade >= 60 ? "from-yellow-400 to-yellow-600"
                  : grade !== undefined && grade >= 0 ? "from-red-400 to-red-600"
                    : "from-gray-400 to-gray-600";

              return (
                <li
                  key={course._id}
                  onClick={() => navigate(`/view-course/${course._id}`)}
                  className="cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div
                    className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-r ${gradeColor} flex items-center justify-center text-white text-3xl font-extrabold shadow-md transition-transform duration-300 hover:scale-110`}
                    title={`Оцінка: ${displayGrade}`}
                  >
                    {displayGrade}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-indigo-900">{course.title}</h3>
                    <p className="text-gray-700 line-clamp-3">{course.description}</p>
                    <p className="mt-2 text-sm text-gray-500 italic">Викладач: {course.teacher.name}</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/view-course/${course._id}`);
                    }}
                    className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                  >
                    Переглянути
                  </Button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div className="mb-16 text-center">
        <BackButton />
      </div>
    </section>
  );
}
