import { useEffect, useState } from 'react';
import { getCourses, Course } from '../../../services/courseService';

export default function AdminCoursesTab({ searchTerm }: { searchTerm: string }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (err) {
                setError('Не вдалося завантажити курси.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

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
                        <p>Тип: {course.published ? 'Оновлення' : 'Нова заявка'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded">✅ Схвалити</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded">❌ Відхилити</button>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded">🔎 Переглянути</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
