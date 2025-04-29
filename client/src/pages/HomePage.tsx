import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <button className="text-red-500 text-3xl font-bold">Hello Tailwind</button>
            <h1>Вітаємо в CoursePoint!</h1>
            {isAuthenticated ? (
                <div>
                    <p>Ви увійшли як: {user?.email}</p>
                    <p>Роль: {user?.role}</p>

                    {user?.role === "student" && (
                        <button onClick={() => navigate("/student")}>До кабінету студента</button>
                    )}

                    {user?.role === "teacher" && (
                        <button onClick={() => navigate("/teacher")}>До кабінету викладача</button>
                    )}

                    {user?.role === "admin" && (
                        <button onClick={() => navigate("/admin")}>До панелі адміністратора</button>
                    )}

                    <button onClick={handleLogout}>Вийти</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => navigate("/login")}>Увійти</button>
                    <button onClick={() => navigate("/register")}>Реєстрація</button>
                </div>
            )}
        </div>
    );
}
