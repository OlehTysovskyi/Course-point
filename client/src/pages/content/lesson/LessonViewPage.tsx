import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLessonById, ContentBlock } from "../../../services/lessonService";
import { updateProgress } from "../../../services/progresService";
import { BackButton } from "../../../components/ui/BackButton";
import { Section } from "lucide-react";

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<{ title: string; blocks: ContentBlock[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    getLessonById(lessonId)
      .then((data) => {
        setLesson({ title: data.title, blocks: data.blocks });
        setLoading(false);
      })
      .catch(() => {
        setError("Не вдалося завантажити урок");
        setLoading(false);
      });
  }, [lessonId]);

  const handleMarkComplete = async () => {
    if (!courseId || !lessonId) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateProgress(courseId, { lessonId });
      setSubmitSuccess(true);
    } catch {
      setSubmitError("Не вдалося оновити прогрес. Спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500 mt-8">Завантаження уроку...</div>;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!lesson) return null;

  return (
    <section>
      <div className="max-w-4xl mt-16 mb-8 mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{lesson.title}</h1>

        <div className="space-y-8">
          {lesson.blocks.map((blk) => {
            switch (blk.type) {
              case "heading":
                return <h2 key={blk.id} className="text-2xl font-semibold text-gray-800">{blk.text}</h2>;
              case "paragraph":
                return (
                  <div
                    key={blk.id}
                    dangerouslySetInnerHTML={{ __html: blk.text || "" }}
                    className="prose prose-lg max-w-none"
                  />
                );
              case "list":
                return (
                  <ul key={blk.id} className="list-disc pl-6 text-gray-700 space-y-1">
                    {blk.items?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                );
              case "quote":
                return (
                  <blockquote key={blk.id} className="border-l-4 pl-4 italic text-gray-600 bg-gray-50 p-4 rounded">
                    {blk.text}
                  </blockquote>
                );
              case "code":
                return (
                  <pre key={blk.id} className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{blk.code}</code>
                  </pre>
                );
              case "video":
                return blk.url ? (
                  <div key={blk.id} className="aspect-video rounded overflow-hidden shadow">
                    <iframe
                      src={blk.url}
                      className="w-full h-full"
                      allowFullScreen
                      title="Відео"
                    ></iframe>
                  </div>
                ) : null;
              case "image":
                return (
                  <div key={blk.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blk.images?.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Зображення ${i + 1}`}
                        className="w-full rounded-lg shadow"
                      />
                    ))}
                  </div>
                );
              case "quiz":
                return (
                  <div key={blk.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                    <p className="font-medium mb-3 text-gray-800">🧠 {blk.question}</p>
                    <ul className="space-y-2">
                      {blk.answers?.map((ans, i) => (
                        <li
                          key={i}
                          className={`p-2 border rounded ${i === blk.correctIndex ? "bg-green-100 border-green-300" : "bg-white"
                            }`}
                        >
                          {ans}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleMarkComplete}
            disabled={isSubmitting || submitSuccess}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Збереження..."
              : submitSuccess
                ? "✓ Урок пройдено"
                : "Позначити як завершений"}
          </button>
          {submitError && <p className="mt-3 text-red-600">{submitError}</p>}
        </div>


      </div>

      <div className="mb-16 text-center">
        <BackButton />
      </div>
    </section>
  );
}
