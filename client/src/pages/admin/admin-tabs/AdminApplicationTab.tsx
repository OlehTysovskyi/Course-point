type Application = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
};

const mockApplications: Application[] = [
    { id: '1', name: 'Іван Іваненко', email: 'ivan@test.com', role: 'teacher' },
    { id: '2', name: 'Марія Петренко', email: 'maria@test.com', role: 'student' },
];

export default function AdminApplicationsTab({ searchTerm }: { searchTerm: string }) {
    const filtered = mockApplications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {filtered.length === 0 && <p>Заявок не знайдено.</p>}
            {filtered.map((app) => (
                <div key={app.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                        <p><strong>{app.name}</strong> ({app.email})</p>
                        <p>Тип: {app.role === 'teacher' ? 'Викладач' : 'Учасник'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded">✅ Прийняти</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded">❌ Відхилити</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
