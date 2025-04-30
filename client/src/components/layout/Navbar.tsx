import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        CoursePoint
      </h1>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-600">{user?.email}</span>

            {user?.role === "student" && (
              <button
                onClick={() => navigate("/student")}
                className="text-blue-600 hover:underline"
              >
                Кабінет студента
              </button>
            )}

            {user?.role === "teacher" && (
              <button
                onClick={() => navigate("/teacher")}
                className="text-blue-600 hover:underline"
              >
                Кабінет викладача
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="text-blue-600 hover:underline"
              >
                Панель адміністратора
              </button>
            )}

            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Увійти
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              Реєстрація
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
