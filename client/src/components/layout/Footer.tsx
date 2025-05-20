import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-white">CoursePoint</h3>
          <p className="text-sm text-gray-400">Онлайн-платформа для навчання з сертифікатами.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Посилання</h4>
          <ul className="text-sm space-y-1">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:underline focus:outline-none"
              >
                Головна
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/courses-list")}
                className="hover:underline focus:outline-none"
              >
                Курси
              </button>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="hover:underline focus:outline-none"
                >
                  Вийти
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="hover:underline focus:outline-none"
                >
                  Увійти
                </button>
              )}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Контакти</h4>
          <p className="text-sm text-gray-400">coursepoint@example.com</p>
          <p className="text-sm text-gray-400">+380 (00) 123-4567</p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-700">
        &copy; {new Date().getFullYear()} CoursePoint. Всі права захищені.
      </div>
    </footer>
  );
}
