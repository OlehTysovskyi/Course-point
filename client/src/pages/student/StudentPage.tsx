import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "student") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Привіт, {user.email}!</h1>
        <p className="mb-6 text-gray-700">Ваша роль: {user.role}</p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Мої курси</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((courseId) => (
              <div
                key={courseId}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">Курс {courseId}</h3>
                <p className="text-sm text-gray-600">Опис курсу №{courseId}</p>
                <button
                  className="mt-4 text-blue-600 hover:underline"
                  onClick={() => navigate(`/courses/${courseId}`)}
                >
                  Переглянути
                </button>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-10 text-red-600 hover:underline"
        >
          Вийти з кабінету
        </button>
      </div>
    </div>
  );
}
