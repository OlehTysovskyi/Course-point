import { useEffect, useState } from 'react';
import {
    getAllCourses,
    updateCourse,
    Course
} from '../../../../services/courseService';
import { useNavigate } from 'react-router-dom';

export default function AdminCoursesTab({ searchTerm }: { searchTerm: string }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (err) {
            setError('Не вдалося завантажити курси.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await updateCourse(id, { published: true });
            fetchCourses();
        } catch (err) {
            console.error("Помилка під час схвалення курсу", err);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateCourse(id, { published: false });
            fetchCourses();
        } catch (err) {
            console.error("Помилка під час відхилення курсу", err);
        }
    };

    const filtered = searchTerm.trim()
        ? courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.teacher?.name?.toLowerCase() || 'невідомо').includes(searchTerm.toLowerCase())
        )
        : courses;

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            {filtered.length === 0 && <p>Курсів не знайдено.</p>}
            {filtered.map((course) => (
                <div key={course._id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                        <p><strong>{course.title}</strong></p>
                        <p>Автор: {course.teacher?.name || 'Невідомо'}</p>
                        <p>Тип: {course.published ? 'Опублікований' : 'Очікує на розгляд'}</p>
                    </div>
                    <div className="flex gap-2">
                        {course.published ? (
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded"
                                onClick={() => handleReject(course._id)}
                            >
                                ❌ Відхилити
                            </button>
                        ) : (
                            <button
                                className="px-3 py-1 bg-green-500 text-white rounded"
                                onClick={() => handleApprove(course._id)}
                            >
                                ✅ Прийняти
                            </button>
                        )}

                        <button
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => navigate(`/teacher/edit-course/${course._id}`)}
                        >
                            🔎 Переглянути
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
