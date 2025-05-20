import { useState } from "react";
import { SearchBar } from "../../../components/ui/SearchBar"; // Імпорт як у StudentPage
import AdminApplicationsTab from "./admin-tabs/AdminApplicationTab";
import AdminUsersTab from "./admin-tabs/AdminUserTab";
import AdminCoursesTab from "./admin-tabs/AdminCourseTab";
import { BackButton } from "../../../components/ui/BackButton";

type Tab = "applications" | "users" | "courses";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("applications");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section>
      <div className="max-w-7xl mx-auto p-6 mb-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-800">
          Панель адміністратора
        </h1>

        <div className="mb-8 max-w-xl mx-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Пошук за назвою, описом або користувачем"
            className="shadow-lg rounded-lg"
          />
        </div>

        <div className="flex gap-4 justify-center mb-6">
          {(["applications", "users", "courses"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-colors duration-300 shadow-md ${activeTab === tab
                  ? "bg-blue-600 text-white shadow-blue-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {tab === "applications"
                ? "Заявки"
                : tab === "users"
                  ? "Користувачі"
                  : "Курси"}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "applications" && <AdminApplicationsTab searchTerm={searchTerm} />}
          {activeTab === "users" && <AdminUsersTab searchTerm={searchTerm} />}
          {activeTab === "courses" && <AdminCoursesTab searchTerm={searchTerm} />}
        </div>
      </div>

      <div className="mb-16 text-center">
        <BackButton />
      </div>

    </section>
  );
}
