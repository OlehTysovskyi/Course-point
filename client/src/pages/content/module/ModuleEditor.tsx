import { ModuleQuestion } from "../../../services/moduleService";

interface Props {
    title: string;
    setTitle: (val: string) => void;
    questions: ModuleQuestion[];
    setQuestions: (val: ModuleQuestion[]) => void;
    onSave: () => void;
    message: string;
    heading: string;
}

export default function ModuleEditor({
    title,
    setTitle,
    questions,
    setQuestions,
    onSave,
    message,
    heading,
}: Props) {
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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{heading}</h1>

            <div className="mb-4">
                <label className="block mb-1 font-medium">Назва модуля</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="border p-4 rounded">
                        <label className="block mb-1 font-semibold">Питання {idx + 1}</label>
                        <input
                            type="text"
                            className="w-full mb-2 border p-2 rounded"
                            value={q.question}
                            onChange={(e) =>
                                updateQuestion(idx, { ...q, question: e.target.value })
                            }
                        />

                        <div className="space-y-2">
                            {q.answers.map((ans, ansIdx) => (
                                <div key={ansIdx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 border p-1 rounded"
                                        value={ans}
                                        onChange={(e) => {
                                            const newAnswers = [...q.answers];
                                            newAnswers[ansIdx] = e.target.value;
                                            updateQuestion(idx, { ...q, answers: newAnswers });
                                        }}
                                    />
                                    <input
                                        type={q.multiple ? "checkbox" : "radio"}
                                        name={`correct-${idx}`}
                                        checked={q.correctAnswers.includes(ansIdx)}
                                        onChange={() => {
                                            let newCorrect: number[];
                                            if (q.multiple) {
                                                newCorrect = q.correctAnswers.includes(ansIdx)
                                                    ? q.correctAnswers.filter((i) => i !== ansIdx)
                                                    : [...q.correctAnswers, ansIdx];
                                            } else {
                                                newCorrect = [ansIdx];
                                            }
                                            updateQuestion(idx, { ...q, correctAnswers: newCorrect });
                                        }}
                                    />
                                    <button
                                        className="text-red-600 hover:underline text-sm"
                                        onClick={() => {
                                            const newAnswers = q.answers.filter((_, i) => i !== ansIdx);
                                            const newCorrectAnswers = q.correctAnswers
                                                .filter((i) => i !== ansIdx)
                                                .map((i) => (i > ansIdx ? i - 1 : i));
                                            updateQuestion(idx, {
                                                ...q,
                                                answers: newAnswers,
                                                correctAnswers: newCorrectAnswers,
                                            });
                                        }}
                                        title="Видалити відповідь"
                                    >
                                        🗑
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            className="text-sm text-blue-600 mt-2"
                            onClick={() => {
                                const newAnswers = [...q.answers, `Варіант ${q.answers.length + 1}`];
                                updateQuestion(idx, { ...q, answers: newAnswers });
                            }}
                        >
                            + Додати відповідь
                        </button>

                        <div className="mt-2">
                            <label className="mr-2">Кілька відповідей?</label>
                            <input
                                type="checkbox"
                                checked={q.multiple}
                                onChange={(e) => {
                                    updateQuestion(idx, {
                                        ...q,
                                        multiple: e.target.checked,
                                        correctAnswers: e.target.checked
                                            ? q.correctAnswers
                                            : q.correctAnswers.slice(0, 1),
                                    });
                                }}
                            />
                        </div>

                        <button
                            className="mt-4 text-red-600"
                            onClick={() => removeQuestion(idx)}
                        >
                            Видалити питання
                        </button>
                    </div>
                ))}
            </div>

            <button
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
                onClick={addQuestion}
            >
                Додати питання
            </button>

            <div className="mt-4">
                <button
                    className="px-6 py-2 bg-blue-700 text-white rounded"
                    onClick={onSave}
                >
                    Зберегти модуль
                </button>
                {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
            </div>
        </div>
    );
}
