import { requestApi } from "../api/requestApi";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  role: "student" | "teacher";
}

export interface User {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await requestApi.post<{ user: User }>("/auth/login", { email, password });
    return response.data.user;
  },

  register: async (data: RegisterData): Promise<void> => {
    await requestApi.post("/auth/register", data);
  },

  logout: async (): Promise<void> => {
    await requestApi.post("/auth/logout", {});
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await requestApi.get<{ user: User }>("/auth/me");
    return response.data.user;
  },
};
