import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { createModule, ModuleQuestion } from "../../../services/moduleService";
import ModuleForm from "./ModuleEditor";

export default function ModuleCreatePage() {
    const { courseId } = useParams();
    const [searchParams] = useSearchParams();
    const graded = searchParams.get("graded") === "true";

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<ModuleQuestion[]>([]);
    const [grade, setGrade] = useState(0);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!courseId) {
            setMessage("Немає courseId");
            return;
        }

        try {
            await createModule({
                title,
                course: courseId,
                questions,
                ...(graded && { grade }),
                graded,
            });
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
            grade={grade}
            setGrade={setGrade}
            onSave={handleSave}
            message={message}
            heading={graded ? "Створення оцінювального модуля" : "Створення неоцінювального модуля"}
            graded={graded}
        />
    );
}