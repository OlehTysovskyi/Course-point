import { useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string;
  teacher: string;
};

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myCourses, setMyCourses] = useState<Course[]>([
    // Це приклад курсів, їх можна буде замінити на реальні дані з API
    { id: "1", title: "Курс з React", description: "Основи React та JSX", teacher: "Викладач 1" },
    { id: "2", title: "Курс з TypeScript", description: "Основи TypeScript", teacher: "Викладач 2" },
  ]);

  const [allCourses, setAllCourses] = useState<Course[]>([
    // Це приклад всіх доступних курсів, їх можна буде замінити на реальні дані з API
    { id: "3", title: "Курс з Node.js", description: "Основи Node.js для початківців", teacher: "Викладач 3" },
    { id: "4", title: "Курс з MongoDB", description: "Базові знання про MongoDB", teacher: "Викладач 4" },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Мої курси</h1>

      {/* Пошук */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Пошук курсу"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full border rounded p-2 bg-white"
        />
      </div>

      {/* Мої курси */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Мої курси</h2>
        <ul className="space-y-4">
          {myCourses.map(course => (
            <li key={course.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="text-sm text-gray-500">Викладач: {course.teacher}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Всі курси (відфільтровані) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Всі доступні курси</h2>
        <ul className="space-y-4">
          {filteredCourses.map(course => (
            <li key={course.id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="text-sm text-gray-500">Викладач: {course.teacher}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
