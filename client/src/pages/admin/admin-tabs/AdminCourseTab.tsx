type Course = {
    id: string;
    title: string;
    author: string;
    status: 'new' | 'update';
};

const mockCourses: Course[] = [
    { id: '1', title: 'Основи React', author: 'Іван Іваненко', status: 'new' },
    { id: '2', title: 'Продвинутий JavaScript', author: 'Марія Петренко', status: 'update' },
];

export default function AdminCoursesTab({ searchTerm }: { searchTerm: string }) {
    const filtered = mockCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {filtered.length === 0 && <p>Курсів не знайдено.</p>}
            {filtered.map((course) => (
                <div key={course.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                        <p><strong>{course.title}</strong></p>
                        <p>Автор: {course.author}</p>
                        <p>Тип: {course.status === 'new' ? 'Нова заявка' : 'Оновлення'}</p>
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
