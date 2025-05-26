import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../../services/courseService";
import { BackButton } from "../../../components/ui/BackButton";

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
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">Створити курс</h1>

      <div className="bg-white shadow-xl rounded-3xl p-6 space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-2">Назва курсу</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть назву курсу"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Опис курсу</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть опис курсу"
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded-xl text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? "Створюємо..." : "Створити курс"}
        </button>
      </div>

      <div className="mt-10 text-center">
        <BackButton />
      </div>
    </section>
  );
}
