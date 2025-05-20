import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getModuleById, ModuleQuestion } from "../../../services/moduleService";
import { updateProgress } from "../../../services/progresService";
import { BackButton } from "../../../components/ui/BackButton";

const PAGE_SIZE = 5;

export default function ModuleTakePage() {
    const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
    const [questions, setQuestions] = useState<ModuleQuestion[]>([]);
    const [answers, setAnswers] = useState<number[][]>([]);
    const [completed, setCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (moduleId) {
            getModuleById(moduleId).then((mod) => {
                setQuestions(mod.questions || []);
                setAnswers(Array(mod.questions?.length || 0).fill([]));
            });
        }
    }, [moduleId]);

    const toggleAnswer = (questionIndex: number, answerIndex: number) => {
        const newAnswers = [...answers];
        const current = newAnswers[questionIndex];
        const question = questions[questionIndex];
        if (!question) return;

        if (question.multiple) {
            if (current.includes(answerIndex)) {
                newAnswers[questionIndex] = current.filter((i) => i !== answerIndex);
            } else {
                newAnswers[questionIndex] = [...current, answerIndex];
            }
        } else {
            newAnswers[questionIndex] = [answerIndex];
        }

        setAnswers(newAnswers);
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, i) => {
            const selected = answers[i]?.slice().sort() || [];
            const correct = q.correctAnswers.slice().sort();
            if (selected.length === correct.length && selected.every((v, idx) => v === correct[idx])) {
                score += 1;
            }
        });
        return score;
    };

    const submitAllAnswers = async () => {
        if (!moduleId || !courseId) return;

        const map: Record<number, number[]> = {};
        answers.forEach((ans, i) => {
            if (ans.length > 0) {
                map[i] = ans;
            }
        });

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await updateProgress(courseId, {
                moduleId,
                answersMap: map,
            });
            setSubmitSuccess(true);
            setCompleted(true);
        } catch (e) {
            setSubmitError("Не вдалося оновити прогрес. Спробуйте пізніше.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!questions.length) return <div className="p-6">Завантаження...</div>;

    if (completed) {
        const score = calculateScore();

        return (
            <div
                className="flex flex-col justify-center items-center"
                style={{ minHeight: "calc(100vh - 35vh)" }}
            >
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg w-full mx-4">
                    <h2 className="text-3xl font-bold mb-4 text-green-700">Модуль завершено 🎉</h2>
                    <p className="text-lg mb-6">
                        Ваш результат: <span className="font-semibold">{score}</span> / {questions.length}
                    </p>

                    {isSubmitting && <p className="text-blue-600 mb-4">Оцінювання та збереження результату...</p>}
                    {submitSuccess && <p className="text-green-600 mb-4 font-semibold">Прогрес успішно оновлено!</p>}
                    {submitError && <p className="text-red-600 mb-4 font-semibold">{submitError}</p>}

                    <button
                        onClick={() => navigate(`/view-course/${courseId}`)}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-colors duration-200"
                    >
                        Повернутися до огляду курсу
                    </button>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(questions.length / PAGE_SIZE);
    const paginatedQuestions = questions.length > PAGE_SIZE
        ? questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
        : questions;

    const startQuestionIndex = page * PAGE_SIZE;

    return (
        <section>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm shadow-gray-200 mt-8 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 tracking-wide">
                    Питання {page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, questions.length)} з {questions.length}
                </h2>

                <div className="space-y-6">
                    {paginatedQuestions.map((q, i) => {
                        const questionIndex = page * PAGE_SIZE + i;
                        return (
                            <div
                                key={questionIndex}
                                className="p-5 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <p className="font-semibold text-lg text-gray-800 mb-3">{q.question}</p>
                                <div className="space-y-3">
                                    {q.answers.map((ans, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-3 cursor-pointer select-none text-gray-700 hover:text-blue-600 transition-colors duration-150"
                                        >
                                            <input
                                                type={q.multiple ? "checkbox" : "radio"}
                                                name={`q-${questionIndex}`}
                                                checked={answers[questionIndex]?.includes(idx) || false}
                                                onChange={() => toggleAnswer(questionIndex, idx)}
                                                className="w-5 h-5 text-blue-600 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all duration-150"
                                            />
                                            <span className="text-base font-medium">{ans}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {questions.length > PAGE_SIZE && (
                    <div className="flex justify-between mt-8">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Назад
                        </button>
                        <button
                            disabled={page + 1 === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Далі
                        </button>
                    </div>
                )}

                <button
                    onClick={submitAllAnswers}
                    disabled={isSubmitting}
                    className="mt-10 w-full py-3 bg-blue-600 text-white text-base font-semibold rounded-xl shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                    {isSubmitting ? "Збереження..." : "Завершити модуль"}
                </button>

                {submitError && <p className="mt-4 text-center text-red-600 font-semibold">{submitError}</p>}
                {submitSuccess && <p className="mt-4 text-center text-green-600 font-semibold">Прогрес оновлено!</p>}
            </div>
            <div className="mb-16 text-center">
                <BackButton />
            </div>
        </section>
    );
}
