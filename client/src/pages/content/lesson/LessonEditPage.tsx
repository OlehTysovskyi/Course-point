import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLessonById, updateLesson, ContentBlock } from "../../../services/lessonService";
import LessonEditor from "./LessonEditor";

export default function LessonEditPage() {
  const { lessonId } = useParams();
  const [initialData, setInitialData] = useState<{ title: string; blocks: ContentBlock[]; courseId: string } | null>(null);
  const [message, setMessage] = useState("");

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
        setMessage("Не вдалося завантажити урок.");
      });
  }, [lessonId]);

  const handleUpdate = async (title: string, blocks: ContentBlock[]) => {
    if (!lessonId || !initialData?.courseId) return;
    try {
      await updateLesson(lessonId, { title, blocks, courseId: initialData.courseId });
      setMessage("Урок оновлено!");
    } catch (err) {
      console.error("Помилка оновлення уроку:", err);
      setMessage("Не вдалося оновити урок.");
    }
  };

  if (!initialData) return <p>Завантаження...</p>;

  return (
    <LessonEditor
      mode="edit"
      onSave={handleUpdate}
      initialData={initialData}
      message={message}
    />
  );
}

