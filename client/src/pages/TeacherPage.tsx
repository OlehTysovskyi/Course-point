import { useAuth } from "../context/AuthContext";

export default function TeacherPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Кабінет викладача</h1>
      <p>Вітаємо, {user?.email}</p>

      {/* Список моїх курсів */}
      <section>
        <h2>Мої курси</h2>
        <ul>
          <li>
            Назва курсу: Frontend
            <ul>
              <li>Студент: Іван Іванов — <button>Схвалити</button> <button>Відхилити</button></li>
              <li>Студент: Олена Петренко — <button>Схвалити</button> <button>Відхилити</button></li>
            </ul>
          </li>
        </ul>
      </section>

      {/* Додати новий курс */}
      <section>
        <h2>Додати новий курс</h2>
        <form>
          <input type="text" placeholder="Назва курсу" />
          <button type="submit">Додати</button>
        </form>
      </section>
    </div>
  );
}
