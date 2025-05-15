import { useState } from 'react';
import SearchBar from './SearchBar';
import AdminApplicationsTab from './admin-tabs/AdminApplicationTab';
import AdminUsersTab from './admin-tabs/AdminUserTab';
import AdminCoursesTab from './admin-tabs/AdminCourseTab';

type Tab = 'applications' | 'users' | 'courses';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('applications');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Панель адміністратора</h1>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex gap-2 my-4">
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`flex-1 py-2 rounded ${activeTab === 'applications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Заявки
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Користувачі
                </button>
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`flex-1 py-2 rounded ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Курси
                </button>
            </div>

            {activeTab === 'applications' && <AdminApplicationsTab searchTerm={searchTerm} />}
            {activeTab === 'users' && <AdminUsersTab searchTerm={searchTerm} />}
            {activeTab === 'courses' && <AdminCoursesTab searchTerm={searchTerm} />}
        </div>
    );
}
