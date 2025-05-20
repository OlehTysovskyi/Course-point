import { useEffect, useState } from "react";
import {
  getRegistrationRequests,
  approveRegistrationRequest,
  rejectRegistrationRequest,
  RegistrationRequest,
} from "../../../../services/authService";

export default function AdminApplicationsTab({ searchTerm }: { searchTerm: string }) {
  const [applications, setApplications] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getRegistrationRequests();
      setApplications(data.filter((app) => app.status === "pending"));
    } catch (err) {
      console.error("Помилка отримання заявок:", err);
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
      fetchApplications();
    } catch (err) {
      console.error("Помилка при схваленні заявки:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRegistrationRequest(id);
      fetchApplications();
    } catch (err) {
      console.error("Помилка при відхиленні заявки:", err);
    }
  };

  const filtered = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {loading && (
        <p className="text-center text-blue-600 text-lg">Завантаження заявок...</p>
      )}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 text-lg">Заявок не знайдено.</p>
      )}
      {filtered.map((app) => (
        <div
          key={app._id}
          className="bg-white rounded-3xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-shadow hover:shadow-lg"
        >
          <div>
            <p className="text-xl font-semibold text-indigo-900">
              {app.name} <span className="text-gray-600 text-sm">({app.email})</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Тип: {app.role === "teacher" ? "Викладач" : "Учасник"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleApprove(app._id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-2xl shadow transition-colors"
            >
              ✅ Прийняти
            </button>
            <button
              onClick={() => handleReject(app._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl shadow transition-colors"
            >
              ❌ Відхилити
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
