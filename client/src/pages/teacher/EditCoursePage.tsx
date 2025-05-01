import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Lesson = {
    id: string;
    title: string;
};

type Module = {
    id: string;
    title: string;
    graded: boolean;
};

type CourseContentItem =
    | { id: string; type: "lesson"; data: Lesson }
    | { id: string; type: "module"; data: Module };

export default function EditCoursePage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseTitle, setCourseTitle] = useState("Курс без назви");
    const [content, setContent] = useState<CourseContentItem[]>([]);

    useEffect(() => {
        // TODO: завантажити курс із серверу за courseId
        setContent([]);
    }, [courseId]);

    const addLesson = () => {
        const newLesson: CourseContentItem = {
            id: uuidv4(),
            type: "lesson",
            data: { id: uuidv4(), title: "Новий урок" },
        };
        setContent((prev) => [...prev, newLesson]);
    };

    const addModule = (graded: boolean) => {
        const newModule: CourseContentItem = {
            id: uuidv4(),
            type: "module",
            data: {
                id: uuidv4(),
                title: graded ? "Оцінювальний модуль" : "Неоцінювальний модуль",
                graded,
            },
        };
        setContent((prev) => [...prev, newModule]);
    };

    const moveItem = (index: number, direction: "up" | "down") => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= content.length) return;
        const newContent = [...content];
        [newContent[index], newContent[newIndex]] = [
            newContent[newIndex],
            newContent[index],
        ];
        setContent(newContent);
    };

    const removeItem = (index: number) => {
        const newContent = [...content];
        newContent.splice(index, 1);
        setContent(newContent);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Редагування курсу: {courseTitle}</h1>

            <div className="flex gap-4 mb-6">
                <button onClick={addLesson} className="bg-green-600 text-white px-4 py-2 rounded-md">
                    ➕ Додати урок
                </button>
                <button onClick={() => addModule(false)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                    ➕ Неоцінювальний модуль
                </button>
                <button onClick={() => addModule(true)} className="bg-red-600 text-white px-4 py-2 rounded-md">
                    ➕ Оцінювальний модуль
                </button>
            </div>

            <div className="space-y-4">
                {content.map((item, index) => (
                    <div
                        key={item.id}
                        className="border p-4 rounded-lg flex items-center justify-between bg-white shadow"
                    >
                        <div className="flex flex-col gap-2 w-full">
                            <div>
                                <strong>{item.type === "lesson" ? "Урок" : "Модуль"}:</strong>{" "}
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    value={item.data.title}
                                    onChange={(e) => {
                                        const newContent = [...content];
                                        newContent[index].data.title = e.target.value;
                                        setContent(newContent);
                                    }}
                                />
                                {item.type === "module" && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({item.data.graded ? "оцінювальний" : "неоцінювальний"})
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => moveItem(index, "up")}
                                    className="px-2 py-1 border rounded"
                                >
                                    ⬆️
                                </button>
                                <button
                                    onClick={() => moveItem(index, "down")}
                                    className="px-2 py-1 border rounded"
                                >
                                    ⬇️
                                </button>
                                <button
                                    onClick={() => removeItem(index)}
                                    className="px-2 py-1 border rounded text-red-500"
                                >
                                    🗑
                                </button>
                                {item.type === "lesson" && (
                                    <button
                                        onClick={() => navigate(`/teacher/edit-lesson/${item.data.id}`)}
                                        className="px-2 py-1 border rounded text-blue-600"
                                    >
                                        ✏️ Редагувати урок
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
