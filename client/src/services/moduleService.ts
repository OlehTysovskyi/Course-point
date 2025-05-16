import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined in the .env file');
}

export interface ModuleQuestion {
    question: string;
    answers: string[];
    correctAnswers: number[];
    multiple: boolean;
}

export interface Module {
    _id: string;
    title: string;
    course: string;
    lessons: string[];
    graded: boolean;
    grade?: number;
    questions: ModuleQuestion[];
    createdAt: string;
}

export interface CreateModuleDto {
    title: string;
    course: string;
    lessons?: string[];
    graded?: boolean;
    grade?: number;
    questions?: ModuleQuestion[];
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getAllModules = async (): Promise<Module[]> => {
    try {
        const res = await axios.get<Module[]>(`${API_URL}/modules`);
        return res.data;
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
};

export const getModuleById = async (id: string): Promise<Module> => {
    try {
        const res = await axios.get<Module>(`${API_URL}/modules/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching module with ID ${id}:`, error);
        throw error;
    }
};

export const getModulesByCourseId = async (courseId: string): Promise<Module[]> => {
    try {
        const res = await axios.get<Module[]>(`${API_URL}/modules/course/${courseId}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching modules for course ID ${courseId}:`, error);
        throw error;
    }
};

export const createModule = async (dto: CreateModuleDto): Promise<Module> => {
    try {
        const res = await axios.post<Module>(`${API_URL}/modules`, dto, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error('Error creating module:', error);
        throw error;
    }
};

export const updateModule = async (id: string, dto: Partial<CreateModuleDto>): Promise<Module> => {
    try {
        const res = await axios.put<Module>(`${API_URL}/modules/${id}`, dto, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error(`Error updating module with ID ${id}:`, error);
        throw error;
    }
};

export const deleteModule = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/modules/${id}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error(`Error deleting module with ID ${id}:`, error);
        throw error;
    }
};
