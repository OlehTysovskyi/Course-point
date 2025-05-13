import { lazy, Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  createLesson,
  getLessonById,
  updateLesson,
  ContentBlock,
} from "../../../services/lessonService";

const TextEditor = lazy(() => import("../../../components/layout/TextEditor"));

export default function LessonEditorPage() {
  const params = useParams();
  const lessonId = params.lessonId || null;
  const courseId = params.courseId || null;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (lessonId && lessonId !== "new") {
      getLessonById(lessonId)
        .then((lesson) => {
          setTitle(lesson.title);
          setBlocks(lesson.blocks);
        })
        .catch((err) => {
          console.error("Помилка завантаження уроку:", err);
        });
    }
  }, [lessonId]);

  const createBlock = (type: ContentBlock["type"]): ContentBlock => {
    const id = uuidv4();
    switch (type) {
      case "heading": return { id, type, level: 2, text: "Заголовок" };
      case "paragraph": return { id, type, text: "Новий абзац" };
      case "list": return { id, type, items: ["Пункт 1"] };
      case "quote": return { id, type, text: "Цитата..." };
      case "code": return { id, type, code: "// код тут" };
      case "video": return { id, type, url: "" };
      case "image": return { id, type, images: [""] };
      case "quiz": return { id, type, question: "Нове питання", answers: ["A", "B"], correctIndex: 0 };
      default: throw new Error("Unknown block");
    }
  };

  const addBlock = (t: ContentBlock["type"]) => setBlocks(bs => [...bs, createBlock(t)]);
  const updateBlock = (idx: number, fn: (b: ContentBlock) => ContentBlock) => {
    setBlocks(bs => bs.map((b, i) => i === idx ? fn(b) : b));
  };
  const move = (i: number, dir: "up" | "down") => {
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= blocks.length) return;
    const a = [...blocks];[a[i], a[j]] = [a[j], a[i]];
    setBlocks(a);
  };
  const remove = (i: number) => {
    const bid = blocks[i].id;
    setBlocks(bs => bs.filter((_, k) => k !== i));
    if (activeId === bid) setActiveId(null);
  };

  const handleSave = async () => {
    if (!courseId) {
      setMessage("Помилка: відсутній courseId.");
      return;
    }

    const payload = { title, blocks, courseId};
    console.log("Aaaaaaaaaaaaa"+payload.courseId)

    try {
      if (lessonId) {
        await updateLesson(lessonId, payload);
        setMessage("Урок оновлено! Тепер ви можете продовжити редагувати його.");
      } else {
        await createLesson(payload);
        setMessage("Урок створено! Тепер ви можете редагувати його.");
      }
    } catch (err) {
      console.error("Помилка збереження уроку:", err);
      setMessage("Сталася помилка при збереженні уроку.");
    }
  };



  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {lessonId && lessonId !== "new" ? "Редагувати урок" : "Створити урок"}
      </h1>

      <input
        className="w-full border p-2 mb-4"
        placeholder="Назва уроку"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {["heading", "paragraph", "list", "quote", "code", "video", "image", "quiz"].map(t => (
          <button
            key={t}
            onClick={() => addBlock(t as ContentBlock["type"])}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {blocks.map((blk, idx) => (
          <div
            key={blk.id}
            className={`border p-4 rounded ${activeId === blk.id ? "border-blue-500" : ""}`}
            onClick={() => setActiveId(blk.id)}
          >
            {blk.type === "heading" && (
              activeId === blk.id
                ? <input
                  type="text"
                  value={blk.text}
                  onChange={e => updateBlock(idx, b => ({ ...b, text: e.target.value }))}
                  placeholder="Заголовок"
                  className="w-full border mb-2 p-1 text-xl font-semibold"
                />
                : <h2 className="text-xl font-semibold">{blk.text}</h2>
            )}

            {blk.type === "paragraph" && (
              activeId === blk.id
                ? <Suspense fallback={<div>Завантаження редактора...</div>}>
                  <TextEditor
                    content={blk.text || ""}
                    onUpdate={(newContent: string) => updateBlock(idx, b => ({ ...b, text: newContent }))}
                  />
                </Suspense>
                : <p dangerouslySetInnerHTML={{ __html: blk.text || "" }} />
            )}

            {blk.type === "list" && (
              <div>
                {blk.items?.map((it, i) =>
                  <input
                    key={i}
                    className="w-full border mb-1 p-1"
                    value={it}
                    onChange={e => {
                      const items = [...blk.items!];
                      items[i] = e.target.value;
                      updateBlock(idx, b => ({ ...b, items }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button onClick={() => updateBlock(idx, b => ({
                    ...b, items: [...(b.items || []), ""]
                  }))} className="text-sm text-blue-600">+Пункт</button>
                )}
              </div>
            )}

            {blk.type === "quote" && (
              activeId === blk.id
                ? <textarea
                  value={blk.text}
                  onChange={e => updateBlock(idx, b => ({ ...b, text: e.target.value }))}
                  className="w-full border italic p-2"
                />
                : <blockquote className="italic border-l-4 pl-4">{blk.text}</blockquote>
            )}

            {blk.type === "code" && (
              activeId === blk.id
                ? <textarea
                  value={blk.code}
                  onChange={e => updateBlock(idx, b => ({ ...b, code: e.target.value }))}
                  className="w-full border font-mono p-2 bg-gray-100"
                />
                : <pre className="font-mono bg-gray-100 p-2">{blk.code}</pre>
            )}

            {blk.type === "video" && (
              <input
                className="w-full border mb-2 p-1"
                placeholder="URL відео"
                value={blk.url}
                onChange={e => updateBlock(idx, b => ({ ...b, url: e.target.value }))}
              />
            )}

            {blk.type === "image" && (
              <div>
                {blk.images?.map((src, i) =>
                  <input
                    key={i}
                    className="w-full border mb-1 p-1"
                    placeholder="URL картинки"
                    value={src}
                    onChange={e => {
                      const images = [...blk.images!];
                      images[i] = e.target.value;
                      updateBlock(idx, b => ({ ...b, images }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button onClick={() => updateBlock(idx, b => ({
                    ...b, images: [...(b.images || []), ""]
                  }))} className="text-sm text-blue-600">+Зображення</button>
                )}
              </div>
            )}

            {blk.type === "quiz" && (
              <div>
                <input
                  className="w-full border mb-1 p-1"
                  placeholder="Питання"
                  value={blk.question}
                  onChange={e => updateBlock(idx, b => ({ ...b, question: e.target.value }))}
                />
                {blk.answers?.map((ans, i) =>
                  <input
                    key={i}
                    className="w-full border mb-1 p-1"
                    placeholder={`Відповідь ${i + 1}`}
                    value={ans}
                    onChange={e => {
                      const answers = [...blk.answers!];
                      answers[i] = e.target.value;
                      updateBlock(idx, b => ({ ...b, answers }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button onClick={() => updateBlock(idx, b => ({
                    ...b, answers: [...(b.answers || []), ""]
                  }))} className="text-sm text-blue-600">+Варіант</button>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button onClick={() => move(idx, "up")} className="px-2 border">⬆️</button>
              <button onClick={() => move(idx, "down")} className="px-2 border">⬇️</button>
              <button onClick={() => remove(idx)} className="px-2 border text-red-500">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <button
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handleSave}
      >
        Зберегти урок
      </button>
    </div>
  );
}
