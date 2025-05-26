import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLessonById, updateLesson, ContentBlock } from "../../../services/lessonService";
import LessonEditor from "./LessonEditor";
import { BackButton } from "../../../components/ui/BackButton";

export default function LessonEditPage() {
  const { lessonId } = useParams();
  const [initialData, setInitialData] = useState<{
    title: string;
    blocks: ContentBlock[];
    courseId: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;

    getLessonById(lessonId)
      .then(lesson => {
        setInitialData({
          title: lesson.title,
          blocks: lesson.blocks,
          courseId: lesson.courseId,
        });
      })
      .catch(err => {
        console.error("Помилка завантаження уроку:", err);
        setMessage("❌ Не вдалося завантажити урок.");
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleUpdate = async (title: string, blocks: ContentBlock[]) => {
    if (!lessonId || !initialData?.courseId) return;

    try {
      await updateLesson(lessonId, { title, blocks, courseId: initialData.courseId });
      setMessage("✅ Урок оновлено!");
    } catch (err) {
      console.error("Помилка оновлення уроку:", err);
      setMessage("❌ Не вдалося оновити урок.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Завантаження...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{message || "Помилка: дані не знайдено."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <LessonEditor
        mode="edit"
        onSave={handleUpdate}
        initialData={initialData}
        message={message}
      />
      
      <div className="mt-10 text-center">
        <BackButton />
      </div>
    </div>
  );
}
