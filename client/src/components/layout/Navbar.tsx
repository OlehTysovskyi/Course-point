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
    <nav className="bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1
        className="text-2xl font-extrabold cursor-pointer drop-shadow-sm hover:text-white/90 transition"
        onClick={() => navigate("/")}
      >
        CoursePoint
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-white/80">{user?.email}</span>

            {user?.role === "student" && (
              <button
                onClick={() => navigate("/student")}
                className="hover:text-yellow-300 font-semibold transition"
              >
                Кабінет студента
              </button>
            )}

            {user?.role === "teacher" && (
              <button
                onClick={() => navigate("/teacher")}
                className="hover:text-yellow-300 font-semibold transition"
              >
                Кабінет викладача
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="hover:text-yellow-300 font-semibold transition"
              >
                Панель адміністратора
              </button>
            )}

            <button
              onClick={handleLogout}
              className="hover:text-red-300 font-semibold transition"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="hover:text-yellow-300 font-semibold transition"
            >
              Увійти
            </button>
            <button
              onClick={() => navigate("/register")}
              className="hover:text-yellow-300 font-semibold transition"
            >
              Реєстрація
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex items-center">
        <button className="text-white hover:text-yellow-300 transition">
          {/* Простий SVG для бургер-меню */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
