import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../../services/courseService";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Назва курсу обов'язкова");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newCourse = await createCourse({ title, description });
      navigate(`/teacher/edit-course/${newCourse._id}`);
    } catch (err) {
      setError("Помилка створення курсу");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Створити новий курс</h1>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Назва курсу</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-4"
          placeholder="Введіть назву курсу"
          disabled={loading}
        />

        <label className="block mb-1 font-medium">Опис курсу</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Введіть опис курсу"
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Створюємо..." : "Створити"}
      </button>
    </div>
  );
}
