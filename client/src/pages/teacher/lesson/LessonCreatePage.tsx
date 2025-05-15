import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createLesson, ContentBlock } from "../../../services/lessonService";
import LessonEditor from "./LessonEditor";

export default function LessonCreatePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleCreate = async (title: string, blocks: ContentBlock[]) => {
    if (!courseId) {
      setMessage("Помилка: courseId не вказано.");
      return;
    }

    try {
      const newLesson = await createLesson({ title, blocks, courseId });
      setMessage("Урок створено!");
      navigate(`/teacher/edit-course/${courseId}`);
    } catch (err) {
      console.error("Помилка створення:", err);
      setMessage("Не вдалося створити урок.");
    }
  };

  return (
    <LessonEditor
      mode="create"
      onSave={handleCreate}
      initialData={{ title: "", blocks: [] }}
      message={message}
    />
  );
}
