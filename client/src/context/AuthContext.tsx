import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode"; // Фікс імпорту

interface User {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    role: "student" | "teacher",
    name: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка логіну");

      const decoded: any = jwtDecode(data.token);
      setUser({
        id: decoded.id,
        email,
        role: decoded.role,
      });

      // Зберігаємо токен для сесії (наприклад в localStorage)
      localStorage.setItem("token", data.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "student" | "teacher",
    name: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка реєстрації");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Перевірка сесії при завантаженні
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        });
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
