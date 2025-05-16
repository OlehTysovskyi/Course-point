import axios from 'axios';

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

export interface Progress {
    _id: string;
    user: string;
    course: string;
    passedModules: string[];
    grade: number;
    createdAt: string;
    updatedAt: string;
}

interface UpdateProgressInput {
    lessonId?: string;
    moduleId?: string;
    deltaGrade?: number;
    answersMap?: { [index: number]: number[] };
}

export const enrollToCourse = async (courseId: string): Promise<Progress> => {
    const response = await axios.post<Progress>(`${API_URL}/progress/enroll`, { courseId }, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const getUserCourses = async (): Promise<string[]> => {
    const response = await axios.get<string[]>(`${API_URL}/progress/courses`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const getProgressByCourse = async (courseId: string): Promise<Progress> => {
    const response = await axios.get<Progress>(`${API_URL}/progress/${courseId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const updateProgress = async (
    courseId: string,
    moduleId: string,
    data: Omit<UpdateProgressInput, 'moduleId'>
): Promise<Progress> => {
    const response = await axios.patch<Progress>(`${API_URL}/progress/${courseId}/${moduleId}`, data, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const unenrollFromCourse = async (courseId: string): Promise<void> => {
    await axios.delete(`${API_URL}/progress/${courseId}`, {
        headers: getAuthHeaders(),
    });
};
