import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined in the .env file');
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get<User[]>(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (userId: string): Promise<User> => {
    try {
        const response = await axios.get<User>(`${API_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
    try {
        const response = await axios.post<User>(`${API_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (userId: string, updatedUser: Partial<User>): Promise<User> => {
    try {
        const response = await axios.put<User>(`${API_URL}/users/${userId}`, updatedUser);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/users/${userId}`);
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};
