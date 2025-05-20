import { useEffect, useState } from 'react';
import { getUsers, deleteUser, User } from '../../../../services/userService';

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
    <div className="space-y-6">
      {loading && (
        <p className="text-center text-blue-600 text-lg">Завантаження користувачів...</p>
      )}
      {error && (
        <p className="text-center text-red-600 text-lg">{error}</p>
      )}
      {!loading && filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 text-lg">Користувачів не знайдено.</p>
      )}
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="bg-white rounded-3xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-shadow hover:shadow-lg"
        >
          <div>
            <p className="text-xl font-semibold text-indigo-900">
              {user.name} <span className="text-gray-600 text-sm">({user.email})</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Роль: {user.role}</p>
          </div>
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl shadow transition-colors"
          >
            🗑️ Видалити
          </button>
        </div>
      ))}
    </div>
  );
}
