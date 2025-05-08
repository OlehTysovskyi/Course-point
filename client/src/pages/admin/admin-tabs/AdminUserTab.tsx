type User = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
};

const mockUsers: User[] = [
    { id: '1', name: 'Олег Василенко', email: 'oleg@test.com', role: 'teacher' },
    { id: '2', name: 'Наталя Бондаренко', email: 'natalia@test.com', role: 'student' },
];

export default function AdminUsersTab({ searchTerm }: { searchTerm: string }) {
    const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {filtered.length === 0 && <p>Користувачів не знайдено.</p>}
            {filtered.map((user) => (
                <div key={user.id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                        <p><strong>{user.name}</strong> ({user.email})</p>
                        <p>Роль: {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded">Змінити роль</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded">Деактивувати</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
