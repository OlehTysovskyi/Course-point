import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CourseBuilderPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    // TODO: Запит до API для створення курсу
    // Після створення - перейти на сторінку редагування модулів
    navigate("/teacher/edit-course/123"); // 123 замінити на id з відповіді
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Створення нового курсу</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Назва курсу</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Опис курсу</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Створити курс
      </button>
    </div>
  );
}
