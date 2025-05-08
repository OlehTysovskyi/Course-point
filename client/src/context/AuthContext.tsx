import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  register: (email: string, password: string, role: "student" | "teacher") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const USE_MOCK = true; // Змінити на false при підключенні бекенду

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((res) => setTimeout(res, 500));
        setUser({ id: "mock-id", email, role: "student" });
        return;
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка логіну");

      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, role: "student" | "teacher") => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((res) => setTimeout(res, 500));
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка реєстрації");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  useEffect(() => {
    setLoading(false); // Можна реалізувати перевірку сесії тут
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};