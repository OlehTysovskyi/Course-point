import { useEffect, useState } from 'react';
import { getUsers, deleteUser, User } from '../../../services/userService';

export default function AdminUsersTab({ searchTerm }: { searchTerm: string }) {
    const [users, setUsers] = useState<User[] | null>(null);
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

    const handleDeleteUser = async (userId: string) => {
        const confirm = window.confirm('Ви впевнені, що хочете видалити цього користувача?');
        if (!confirm) return;

        try {
            await deleteUser(userId);
            setUsers(prev => prev ? prev.filter(u => u._id !== userId) : null);
        } catch (err) {
            alert('Помилка при видаленні користувача');
        }
    };

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
                <div key={user._id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                        <p><strong>{user.name}</strong> ({user.email})</p>
                        <p>Роль: {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Деактивувати
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
