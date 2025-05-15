import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLessonById, ContentBlock } from "../../../services/lessonService";

export default function LessonViewPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<{ title: string; blocks: ContentBlock[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;
    getLessonById(lessonId)
      .then(data => setLesson({ title: data.title, blocks: data.blocks }))
      .catch(err => {
        console.error("Помилка завантаження уроку:", err);
        setError("Не вдалося завантажити урок.");
      });
  }, [lessonId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!lesson) return <p>Завантаження...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      <div className="space-y-6">
        {lesson.blocks.map((blk, i) => (
          <div key={blk.id} className="border-b pb-4">
            {blk.type === "heading" && <h2 className="text-2xl font-semibold">{blk.text}</h2>}
            {blk.type === "paragraph" && (
              <div dangerouslySetInnerHTML={{ __html: blk.text || "" }} className="prose" />
            )}
            {blk.type === "list" && (
              <ul className="list-disc pl-6">
                {blk.items?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
            {blk.type === "quote" && (
              <blockquote className="italic border-l-4 pl-4 text-gray-600">{blk.text}</blockquote>
            )}
            {blk.type === "code" && (
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                <code>{blk.code}</code>
              </pre>
            )}
            {blk.type === "video" && blk.url && (
              <div className="aspect-video">
                <iframe
                  src={blk.url}
                  className="w-full h-full"
                  allowFullScreen
                  title="Відео"
                ></iframe>
              </div>
            )}
            {blk.type === "image" && (
              <div className="flex flex-col gap-4">
                {blk.images?.map((src, i) => (
                  <img key={i} src={src} alt={`Зображення ${i + 1}`} className="max-w-full rounded" />
                ))}
              </div>
            )}
            {blk.type === "quiz" && (
              <div>
                <p className="font-medium mb-2">🧠 {blk.question}</p>
                <ul className="space-y-1">
                  {blk.answers?.map((ans, i) => (
                    <li
                      key={i}
                      className={`p-2 border rounded ${i === blk.correctIndex ? "bg-green-100 border-green-500" : ""
                        }`}
                    >
                      {ans}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
