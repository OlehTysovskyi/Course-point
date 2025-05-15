import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModuleById, updateModule, ModuleQuestion } from "../../../services/moduleService";
import ModuleEditor from "./ModuleEditor";

export default function ModuleEditPage() {
    const { moduleId } = useParams();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<ModuleQuestion[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (moduleId) {
            getModuleById(moduleId).then((mod) => {
                setTitle(mod.title);
                setQuestions(mod.questions || []);
            });
        }
    }, [moduleId]);

    const handleSave = async () => {
        if (!moduleId) {
            setMessage("Немає moduleId");
            return;
        }

        try {
            await updateModule(moduleId, { title, course: "", questions });
            setMessage("Модуль оновлено");
        } catch (err) {
            console.error(err);
            setMessage("Помилка при збереженні модуля");
        }
    };

    return (
        <ModuleEditor
            title={title}
            setTitle={setTitle}
            questions={questions}
            setQuestions={setQuestions}
            onSave={handleSave}
            message={message}
            heading="Редагування модуля"
        />
    );
}
