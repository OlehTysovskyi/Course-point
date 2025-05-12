import { useEffect, useState } from 'react';
import { getUsers } from '../../../services/userService';

type User = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
};

export default function AdminUsersTab({ searchTerm }: { searchTerm: string }) {
    const [users, setUsers] = useState<User[] | null>(null); // Створюємо стан для користувачів
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchUsers = async () => {
        try {
            const fetchedUsers = await getUsers(); 
            if (Array.isArray(fetchedUsers)) {
                setUsers(fetchedUsers);
            } else {
                throw new Error('Отримані дані не є масивом');
            }
        } catch (err) {
            setError('Помилка при завантаженні користувачів');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
}, []);


    const filteredUsers = users ? users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="space-y-4">
            {loading && <p>Завантаження...</p>}
            {error && <p>{error}</p>}
            {filteredUsers.length === 0 && !loading && <p>Користувачів не знайдено.</p>}
            {filteredUsers.map((user) => (
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
