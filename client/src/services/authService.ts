import { requestApi } from "@/api/requestApi";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  role: "student" | "teacher";
}

interface User {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await requestApi.post("/auth/login", { email, password });
    return response.data.user;
  },

  register: async (email: string, password: string, role: "student" | "teacher"): Promise<void> => {
    await requestApi.post("/auth/register", { email, password, role });
  },

  logout: async (): Promise<void> => {
    await requestApi.post("/auth/logout", {});
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await requestApi.get("/auth/me");
    return response.data.user;
  },
};
