import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined in the .env file');
}

export interface ContentBlock {
    id: string;
    type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code' | 'video' | 'image' | 'quiz';
    level?: number;
    text?: string;
    items?: string[];
    code?: string;
    url?: string;
    images?: string[];
    question?: string;
    answers?: string[];
    correctIndex?: number;
}

export interface Lesson {
    _id: string;
    title: string;
    blocks: ContentBlock[];
    courseId: string;
    createdAt: string;
}

export interface CreateLessonDto {
    title: string;
    blocks: ContentBlock[];
    courseId: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getAllLessons = async (): Promise<Lesson[]> => {
    try {
        const response = await axios.get<Lesson[]>(`${API_URL}/lessons`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw error;
    }
};

export const getLessonById = async (id: string): Promise<Lesson> => {
    try {
        const response = await axios.get<Lesson>(`${API_URL}/lessons/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching lesson with ID ${id}:`, error);
        throw error;
    }
};

export const getLessonsByCourseId = async (courseId: string): Promise<Lesson> => {
    try {
        const response = await axios.get<Lesson>(`${API_URL}/lessons/course/${courseId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching lesson with ID ${courseId}:`, error);
        throw error;
    }
};

export const createLesson = async (lesson: CreateLessonDto): Promise<Lesson> => {
    try {
        console.log("Creating lesson with courseId:", lesson.courseId);
        const response = await axios.post<Lesson>(`${API_URL}/lessons`, lesson, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error creating lesson:', error);
        throw error;
    }
};

export const updateLesson = async (id: string, lesson: CreateLessonDto): Promise<Lesson> => {
    try {
        const response = await axios.put<Lesson>(`${API_URL}/lessons/${id}`, lesson, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating lesson with ID ${id}:`, error);
        throw error;
    }
};
