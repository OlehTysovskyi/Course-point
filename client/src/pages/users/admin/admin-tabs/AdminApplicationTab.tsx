import { useEffect, useState } from 'react';
import {
    getRegistrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
    RegistrationRequest,
} from '../../../../services/authService';

export default function AdminApplicationsTab({ searchTerm }: { searchTerm: string }) {
    const [applications, setApplications] = useState<RegistrationRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getRegistrationRequests();
            setApplications(data.filter((app) => app.status === 'pending'));
        } catch (err) {
            console.error('Помилка отримання заявок:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await approveRegistrationRequest(id);
            fetchApplications(); // оновити список після дії
        } catch (err) {
            console.error('Помилка при схваленні заявки:', err);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectRegistrationRequest(id);
            fetchApplications();
        } catch (err) {
            console.error('Помилка при відхиленні заявки:', err);
        }
    };

    const filtered = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {loading && <p>Завантаження...</p>}
            {!loading && filtered.length === 0 && <p>Заявок не знайдено.</p>}
            {filtered.map((app) => (
                <div key={app._id} className="border p-4 rounded flex justify-between items-center">
                    <div>
                        <p><strong>{app.name}</strong> ({app.email})</p>
                        <p>Тип: {app.role === 'teacher' ? 'Викладач' : 'Учасник'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 bg-green-500 text-white rounded"
                            onClick={() => handleApprove(app._id)}
                        >
                            ✅ Прийняти
                        </button>
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() => handleReject(app._id)}
                        >
                            ❌ Відхилити
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
