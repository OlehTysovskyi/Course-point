import { useEffect, useState, useRef } from "react";
import { ModuleQuestion } from "../../../services/moduleService";
import { Lesson, getAvailableLessonsByCourseId } from "../../../services/lessonService";

interface Props {
    title: string;
    setTitle: (val: string) => void;
    questions: ModuleQuestion[];
    setQuestions: (val: ModuleQuestion[]) => void;
    graded: boolean;
    grade: number;
    setGrade: (val: number) => void;
    onSave: () => void;
    message: string;
    heading: string;
    courseId: string;
    selectedLessonIds: string[];
    setSelectedLessonIds: (ids: string[]) => void;
}

export default function ModuleEditor({
    title,
    setTitle,
    questions,
    setQuestions,
    graded,
    grade,
    setGrade,
    onSave,
    message,
    heading,
    courseId,
    selectedLessonIds,
    setSelectedLessonIds,
}: Props) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getAvailableLessonsByCourseId(courseId).then(setLessons).catch(console.error);
    }, [courseId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleLesson = (lessonId: string) => {
        if (selectedLessonIds.includes(lessonId)) {
            setSelectedLessonIds(selectedLessonIds.filter((id) => id !== lessonId));
        } else {
            setSelectedLessonIds([...selectedLessonIds, lessonId]);
        }
    };

    const selectedTitles = lessons
        .filter((lesson) => selectedLessonIds.includes(lesson._id))
        .map((lesson) => lesson.title);

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            {
                question: "Нове питання",
                answers: ["Варіант 1", "Варіант 2"],
                correctAnswers: [0],
                multiple: false,
            },
        ]);
    };

    const updateQuestion = (index: number, updated: ModuleQuestion) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? updated : q)));
    };

    const removeQuestion = (index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">{heading}</h1>

            <label className="block mb-2 font-semibold text-gray-700">Назва модуля</label>
            <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 mb-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <div className="mb-8">
                <label className="block mb-2 font-semibold text-gray-700">Уроки модуля</label>
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm transition font-medium"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {dropdownOpen ? "Закрити список" : "Обрати уроки"}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-full mt-2 max-h-48 overflow-y-auto">
                            {lessons.map((lesson) => (
                                <div
                                    key={lesson._id}
                                    onClick={() => toggleLesson(lesson._id)}
                                    className={`cursor-pointer px-3 py-2 rounded-lg transition ${selectedLessonIds.includes(lesson._id)
                                        ? "bg-blue-100 font-semibold text-blue-800"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    {lesson.title}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                        Обрані уроки: {selectedTitles.join(", ") || "немає"}
                    </div>
                </div>
            </div>

            {graded && (
                <div className="mb-8">
                    <label className="block mb-2 font-semibold text-gray-700">Максимальна оцінка</label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                    />
                </div>
            )}

            <div className="mb-10">
                <label className="block mb-2 font-semibold text-gray-700">Питання</label>
                <div className="space-y-6">
                    {questions.map((q, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 rounded-xl p-5 shadow-sm transition hover:shadow-md bg-gray-50"
                        >
                            <input
                                type="text"
                                className="w-full border-b text-lg border-gray-400 rounded-xl font-medium p-2 mb-3 focus:outline-none focus:border-blue-500"
                                value={q.question}
                                onChange={(e) => updateQuestion(idx, { ...q, question: e.target.value })}
                                placeholder="Питання"
                            />

                            <label className="flex items-center mb-4 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={q.multiple}
                                    onChange={(e) => updateQuestion(idx, { ...q, multiple: e.target.checked })}
                                />
                                Декілька правильних відповідей
                            </label>

                            {q.answers.map((ans, i) => (
                                <div key={i} className="flex items-center gap-2 mb-2">
                                    <input
                                        className="flex-1 border rounded-xl p-2"
                                        value={ans}
                                        onChange={(e) => {
                                            const newAnswers = [...q.answers];
                                            newAnswers[i] = e.target.value;
                                            updateQuestion(idx, { ...q, answers: newAnswers });
                                        }}
                                        placeholder={`Відповідь ${i + 1}`}
                                    />
                                    <input
                                        type="checkbox"
                                        checked={q.correctAnswers.includes(i)}
                                        onChange={(e) => {
                                            const newCorrectAnswers = q.correctAnswers.includes(i)
                                                ? q.correctAnswers.filter((ci) => ci !== i)
                                                : [...q.correctAnswers, i];

                                            updateQuestion(idx, {
                                                ...q,
                                                correctAnswers: q.multiple ? newCorrectAnswers : [i],
                                            });
                                        }}
                                        title="Правильна відповідь"
                                    />
                                </div>
                            ))}

                            <button
                                className="text-sm text-blue-600 hover:underline mt-1"
                                onClick={() =>
                                    updateQuestion(idx, {
                                        ...q,
                                        answers: [...q.answers, ""],
                                    })
                                }
                            >
                                + Варіант
                            </button>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => removeQuestion(idx)}
                                    className="px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-sm"
                                >
                                    🗑️ Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="mt-6 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm transition"
                    onClick={addQuestion}
                >
                    + Питання
                </button>
            </div>

            {message && <p className="text-green-600 mt-4">{message}</p>}

            <button
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
                onClick={onSave}
            >
                Зберегти модуль
            </button>
        </div>
    );
}
