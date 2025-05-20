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
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getAllCourses();
            const sorted = [...data].sort((a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            setCourses(sorted);
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

    const filtered = courses.filter(course => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.teacher?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (course.published ? 'опублікований' : 'неопублікований').includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'published' && course.published) ||
            (statusFilter === 'unpublished' && !course.published);

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <p className="text-center text-blue-600 text-lg">Завантаження курсів...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600 text-lg">{error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-4 justify-center mb-4">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-full font-medium transition shadow-md ${statusFilter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    Усі
                </button>
                <button
                    onClick={() => setStatusFilter('published')}
                    className={`px-4 py-2 rounded-full font-medium transition shadow-md ${statusFilter === 'published'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    Опубліковані
                </button>
                <button
                    onClick={() => setStatusFilter('unpublished')}
                    className={`px-4 py-2 rounded-full font-medium transition shadow-md ${statusFilter === 'unpublished'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    Неопубліковані
                </button>
            </div>

            {filtered.length === 0 && (
                <p className="text-center text-gray-500 text-lg">Курсів не знайдено.</p>
            )}

            {filtered.map((course) => (
                <div
                    key={course._id}
                    className="bg-white rounded-3xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-shadow hover:shadow-lg"
                >
                    <div>
                        <p className="text-xl font-semibold text-indigo-900 mb-1">{course.title}</p>
                        <p className="text-sm text-gray-600">Автор: {course.teacher?.name || 'Невідомо'}</p>
                        <p className={`text-sm font-medium ${course.published ? 'text-green-600' : 'text-yellow-600'}`}>
                            Статус: {course.published ? '✅ Опублікований' : '⏳ Очікує на розгляд'}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {course.published ? (
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl shadow transition-colors"
                                onClick={() => handleReject(course._id)}
                            >
                                ❌ Відхилити
                            </button>
                        ) : (
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-2xl shadow transition-colors"
                                onClick={() => handleApprove(course._id)}
                            >
                                ✅ Прийняти
                            </button>
                        )}
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl shadow transition-colors"
                            onClick={() => navigate(`/view-course/${course._id}`)}
                        >
                            🔎 Переглянути
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
