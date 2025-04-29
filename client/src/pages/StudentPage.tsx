import { useAuth } from "../context/AuthContext";

export default function StudentPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Кабінет студента</h1>
      <p>Вітаємо, {user?.email}</p>

      {/* Список доступних курсів */}
      <section>
        <h2>Доступні курси</h2>
        <ul>
          <li>Курс №1 <button>Подати заявку</button></li>
          <li>Курс №2 <button>Подати заявку</button></li>
          {/* це буде динамічно з БД пізніше */}
        </ul>
      </section>

      {/* Заявки студента */}
      <section>
        <h2>Мої заявки</h2>
        <ul>
          <li>Курс №1 — в обробці</li>
          <li>Курс №2 — підтверджено</li>
          {/* так само буде динамічно */}
        </ul>
      </section>
    </div>
  );
}
