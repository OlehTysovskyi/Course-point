import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login, register, verifyToken } from "../services/authService"; // Імпортуємо сервіс

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
  register: (email: string, password: string, role: "student" | "teacher", name: string) => Promise<void>;
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

  const loginHandler = async (email: string, password: string) => {
    setLoading(true);
    try {
      const token = await login(email, password);
      const decoded = verifyToken(token);
      setUser({
        id: decoded.id,
        email,
        role: decoded.role,
      });

      localStorage.setItem("token", token);
    } finally {
      setLoading(false);
    }
  };

  const registerHandler = async (
    email: string,
    password: string,
    role: "student" | "teacher",
    name: string
  ) => {
    setLoading(true);
    try {
      await register(email, password, role, name);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = verifyToken(token); // Декодуємо токен
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
      value={{ user, isAuthenticated: !!user, loading, login: loginHandler, logout, register: registerHandler }}
    >
      {children}
    </AuthContext.Provider>
  );
};
