import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined in the .env file');
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

export interface RegistrationRequest {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    status: 'pending' | 'approved' | 'rejected';
}

export const login = async (email: string, password: string): Promise<string> => {
    const response = await axios.post<{ token: string }>(`${API_URL}/auth/login`, { email, password });
    return response.data.token;
};

export const register = async (
    email: string,
    password: string,
    role: "student" | "teacher",
    name: string
): Promise<void> => {
    await axios.post(`${API_URL}/auth/request`, { email, password, role, name });
};

export const getRegistrationRequests = async (): Promise<RegistrationRequest[]> => {
    const response = await axios.get<RegistrationRequest[]>(`${API_URL}/auth/request`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const approveRegistrationRequest = async (id: string): Promise<void> => {
    await axios.patch(`${API_URL}/auth/request/${id}/approve`, null, {
        headers: getAuthHeaders(),
    });
};

export const rejectRegistrationRequest = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/auth/request/${id}`, {
        headers: getAuthHeaders(),
    });
};

export const verifyToken = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);
        return decoded;
    } catch {
        throw new Error("Invalid token");
    }
};

export const logout = (): void => {
    localStorage.removeItem('token');
};
