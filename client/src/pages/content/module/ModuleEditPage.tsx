import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModuleById, updateModule, ModuleQuestion } from "../../../services/moduleService";
import ModuleEditor from "./ModuleEditor";
import { BackButton } from "../../../components/ui/BackButton";

export default function ModuleEditPage() {
    const { moduleId } = useParams();

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<ModuleQuestion[]>([]);
    const [grade, setGrade] = useState(0);
    const [graded, setGraded] = useState(false);
    const [message, setMessage] = useState("");

    const [courseId, setCourseId] = useState<string>("");
    const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);

    useEffect(() => {
        if (moduleId) {
            getModuleById(moduleId).then((mod) => {
                setTitle(mod.title);
                setQuestions(mod.questions || []);
                setGrade(mod.grade || 0);
                setGraded(mod.graded || false);
                setCourseId(mod.course);
                setSelectedLessonIds(mod.lessons || []);
            });
        }
    }, [moduleId]);

    const handleSave = async () => {
        if (!moduleId) {
            setMessage("Немає moduleId");
            return;
        }
        if (!courseId) {
            setMessage("Немає courseId");
            return;
        }

        try {
            await updateModule(moduleId, {
                title,
                course: courseId,
                lessons: selectedLessonIds,
                questions,
                ...(graded && { grade }),
                graded,
            });
            setMessage("Модуль оновлено");
        } catch (err) {
            console.error(err);
            setMessage("Помилка при збереженні модуля");
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <ModuleEditor
                title={title}
                setTitle={setTitle}
                questions={questions}
                setQuestions={setQuestions}
                grade={grade}
                setGrade={setGrade}
                onSave={handleSave}
                message={message}
                heading="Редагування модуля"
                graded={graded}
                courseId={courseId}
                selectedLessonIds={selectedLessonIds}
                setSelectedLessonIds={setSelectedLessonIds}
            />

            <div className="mt-10 text-center">
                <BackButton />
            </div>
        </div>
    );

}
