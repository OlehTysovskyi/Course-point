import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Props = {
  title: string;
  showRole?: boolean;
  onSuccess?: () => void;
};

export default function AuthForm({ title, showRole = false, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (showRole) {
        if (password !== confirmPassword) {
          return setError("Паролі не збігаються");
        }
        if (!validatePassword(password)) {
          return setError(
            "Пароль повинен містити щонайменше 8 символів, великі та малі літери, цифру і спецсимвол"
          );
        }
        await register(email, password, role, name);
        onSuccess ? onSuccess() : navigate("/login");
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        {showRole && ( // ДОДАНО поле ім'я тільки для реєстрації
          <input
            type="text"
            placeholder="Ім'я"
            className="w-full mb-4 p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Пароль"
            className="w-full p-2 border rounded-md pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-2 top-2 text-sm text-blue-600"
          >
            {showPwd ? "Сховати" : "Показати"}
          </button>
        </div>

        {showRole && (
          <>
            <div className="relative mb-4">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Підтвердіть пароль"
                className="w-full p-2 border rounded-md pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "student" | "teacher")}
              className="w-full mb-4 p-2 border rounded-md"
            >
              <option value="student">Студент</option>
              <option value="teacher">Викладач</option>
            </select>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Завантаження..." : title}
        </button>
      </form>
    </div>
  );
}
