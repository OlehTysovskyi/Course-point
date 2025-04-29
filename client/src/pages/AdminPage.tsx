import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Панель адміністратора</h1>
      <p>Вітаємо, {user?.email}</p>

      {/* Заявки на реєстрацію */}
      <section>
        <h2>Очікують підтвердження</h2>
        <ul>
          <li>
            Користувач: student@example.com (роль: student)
            <button>Схвалити</button>
            <button>Відхилити</button>
          </li>
          <li>
            Користувач: teacher@example.com (роль: teacher)
            <button>Схвалити</button>
            <button>Відхилити</button>
          </li>
        </ul>
      </section>

      {/* Управління курсами */}
      <section>
        <h2>Курси</h2>
        <ul>
          <li>
            Назва: Frontend від Іван Іванов
            <button>Видалити</button>
          </li>
          <li>
            Назва: Backend від Олена Петренко
            <button>Видалити</button>
          </li>
        </ul>
      </section>
    </div>
  );
}
