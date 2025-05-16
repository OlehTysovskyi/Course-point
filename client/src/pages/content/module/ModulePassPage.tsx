import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModuleById, ModuleQuestion } from "../../../services/moduleService";
import { updateProgress } from "../../../services/progresService";

export default function ModuleTakePage() {
    const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
    const [questions, setQuestions] = useState<ModuleQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[][]>([]);
    const [completed, setCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (moduleId) {
            getModuleById(moduleId).then((mod) => {
                setQuestions(mod.questions || []);
                setAnswers(Array(mod.questions?.length || 0).fill([]));
            });
        }
    }, [moduleId]);

    const currentQuestion = questions[currentIndex];

    const toggleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        const current = newAnswers[currentIndex];

        if (currentQuestion.multiple) {
            if (current.includes(answerIndex)) {
                newAnswers[currentIndex] = current.filter((i) => i !== answerIndex);
            } else {
                newAnswers[currentIndex] = [...current, answerIndex];
            }
        } else {
            newAnswers[currentIndex] = [answerIndex];
        }

        setAnswers(newAnswers);
    };

    const goNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCompleted(true);
        }
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, i) => {
            const selected = answers[i].slice().sort();
            const correct = q.correctAnswers.slice().sort();
            if (selected.length === correct.length && selected.every((v, idx) => v === correct[idx])) {
                score += 1;
            }
        });
        return score;
    };

    useEffect(() => {
        const submitProgress = async () => {
            if (!completed || !moduleId || !courseId) return;

            const map: Record<number, number[]> = {};
            answers.forEach((ans, i) => {
                if (ans.length > 0) {
                    map[i] = ans;
                }
            });

            setIsSubmitting(true);
            setSubmitError(null);
            try {
                await updateProgress(courseId, moduleId, {
                    lessonId: undefined,
                    answersMap: map
                });
                setSubmitSuccess(true);
            } catch (e) {
                setSubmitError("Не вдалося оновити прогрес. Спробуйте пізніше.");
            } finally {
                setIsSubmitting(false);
            }
        };

        submitProgress();
    }, [completed]);


    if (!questions.length) return <div className="p-6">Завантаження...</div>;

    if (completed) {
        const score = calculateScore();

        return (
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Модуль завершено</h2>
                <p className="mb-2">Ваш результат: {score} / {questions.length}</p>

                {isSubmitting && <p className="text-blue-600">Оцінювання та збереження результату...</p>}
                {submitSuccess && <p className="text-green-600">Прогрес успішно оновлено!</p>}
                {submitError && <p className="text-red-600">{submitError}</p>}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">Питання {currentIndex + 1} з {questions.length}</h2>
            <p className="mb-4 font-medium">{currentQuestion.question}</p>

            <div className="space-y-2">
                {currentQuestion.answers.map((ans, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                        <input
                            type={currentQuestion.multiple ? "checkbox" : "radio"}
                            name={`q-${currentIndex}`}
                            checked={answers[currentIndex]?.includes(idx)}
                            onChange={() => toggleAnswer(idx)}
                        />
                        <span>{ans}</span>
                    </label>
                ))}
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    onClick={goBack}
                    disabled={currentIndex === 0}
                >
                    Назад
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={goNext}
                >
                    {currentIndex + 1 === questions.length ? "Завершити" : "Далі"}
                </button>
            </div>
        </div>
    );
}
