import { useNavigate } from "react-router-dom";

export default function TeacherPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Кабінет викладача</h1>

      <p className="mb-4 text-gray-700">
        Тут ви можете керувати своїми курсами, створювати нові та переглядати статистику.
      </p>

      <button
        onClick={() => navigate("/teacher/create-course")}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        ➕ Створити новий курс
      </button>
    </div>
  );
}
