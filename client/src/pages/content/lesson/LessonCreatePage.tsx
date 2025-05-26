import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createLesson, ContentBlock } from "../../../services/lessonService";
import LessonEditor from "./LessonEditor";
import { BackButton } from "../../../components/ui/BackButton";

export default function LessonCreatePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleCreate = async (title: string, blocks: ContentBlock[]) => {
    if (!courseId) {
      setMessage("❌ Помилка: courseId не вказано.");
      return;
    }

    try {
      await createLesson({ title, blocks, courseId });
      setMessage("✅ Урок створено!");
      setTimeout(() => navigate(`/teacher/edit-course/${courseId}`), 1000);
    } catch (err) {
      console.error("Помилка створення:", err);
      setMessage("❌ Не вдалося створити урок.");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <LessonEditor
        mode="create"
        onSave={handleCreate}
        initialData={{ title: "", blocks: [] }}
        message={message}
      />

      <div className="mt-10 text-center">
        <BackButton />
      </div>
    </div>
  );
}
