import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined in the .env file');
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    teacher: {
        _id: string;
        name: string;
        email: string;
    };
    lessons: string[];
    modules: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CourseInput {
    title: string;
    description: string;
    lessons?: string[];
    modules?: string[];
    published?: boolean;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getAllCourses = async (): Promise<Course[]> => {
    try {
        const response = await axios.get<Course[]>(`${API_URL}/courses/all`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all admin courses:', error);
        throw error;
    }
};

export const getAllPublishedCourses = async (): Promise<Course[]> => {
    try {
        const response = await axios.get<Course[]>(`${API_URL}/courses`);
        return response.data;
    } catch (error) {
        console.error('Error fetching published courses:', error);
        throw error;
    }
};

export const getAllCoursesByTeacher = async (id: string): Promise<Course[]> => {
  try {
    const response = await axios.get<Course[]>(`${API_URL}/courses/teacher/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher's courses:", error);
    throw error;
  }
};

export const getAllUserCourses = async (): Promise<Course[]> => {
    try {
        const response = await axios.get<Course[]>(`${API_URL}/progress/courses`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user courses:", error);
        throw error;
    }
};
export const getCourseById = async (id: string): Promise<Course> => {
    try {
        const response = await axios.get<Course>(`${API_URL}/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with ID ${id}:`, error);
        throw error;
    }
};

export const createCourse = async (course: CourseInput): Promise<Course> => {
    try {
        const response = await axios.post<Course>(`${API_URL}/courses`, course, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

export const updateCourse = async (
    id: string,
    course: Partial<CourseInput>
): Promise<Course> => {
    try {
        const response = await axios.put<Course>(`${API_URL}/courses/${id}`, course, {
            headers: getAuthHeaders(),
        });
        console.log(getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error updating course with ID ${id}:`, error);
        throw error;
    }
};

export const deleteCourse = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/courses/${id}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error(`Error deleting course with ID ${id}:`, error);
        throw error;
    }
};
