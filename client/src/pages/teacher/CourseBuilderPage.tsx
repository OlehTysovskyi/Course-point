import { useState } from "react";

interface CourseElement {
  id: string;
  type: "lesson" | "module";
  title: string;
}

export default function CourseBuilder() {
  const [elements, setElements] = useState<CourseElement[]>([]);

  const addElement = (type: "lesson" | "module") => {
    const newElement: CourseElement = {
      id: crypto.randomUUID(),
      type,
      title: type === "lesson" ? "Новий урок" : "Новий модуль",
    };
    setElements((prev) => [...prev, newElement]);
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Конструктор курсу</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => addElement("lesson")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          + Додати урок
        </button>
        <button
          onClick={() => addElement("module")}
          className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
        >
          + Додати модуль
        </button>
      </div>

      <div className="space-y-4">
        {elements.map((el, index) => (
          <div
            key={el.id}
            className="flex justify-between items-center border p-4 rounded-xl bg-white shadow"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {index + 1}. {el.title}
              </h3>
              <p className="text-sm text-gray-500">Тип: {el.type === "lesson" ? "Урок" : "Модуль"}</p>
            </div>
            <button
              onClick={() => removeElement(el.id)}
              className="text-red-600 hover:underline"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
