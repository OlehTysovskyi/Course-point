import { useState } from "react";
import { useParams } from "react-router-dom";
import { createModule, ModuleQuestion } from "../../../services/moduleService";
import ModuleForm from "./ModuleEditor";

export default function ModuleCreatePage() {
    const { courseId } = useParams();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<ModuleQuestion[]>([]);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!courseId) {
            setMessage("Немає courseId");
            return;
        }

        try {
            await createModule({ title, course: courseId, questions });
            setMessage("Модуль створено");
        } catch (err) {
            console.error(err);
            setMessage("Помилка при створенні модуля");
        }
    };

    return (
        <ModuleForm
            title={title}
            setTitle={setTitle}
            questions={questions}
            setQuestions={setQuestions}
            onSave={handleSave}
            message={message}
            heading="Створення модуля"
        />
    );
}
