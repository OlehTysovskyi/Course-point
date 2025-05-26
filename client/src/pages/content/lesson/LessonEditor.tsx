import { lazy, Suspense, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentBlock } from "../../../services/lessonService";

const TextEditor = lazy(() => import("../../../components/layout/TextEditor"));

type LessonEditorProps = {
  mode: "create" | "edit";
  onSave: (title: string, blocks: ContentBlock[]) => void;
  initialData: { title: string; blocks: ContentBlock[] };
  message?: string;
};

export default function LessonEditor({ mode, onSave, initialData, message }: LessonEditorProps) {
  const [title, setTitle] = useState(initialData.title);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialData.blocks);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    const a = [...blocks]; [a[i], a[j]] = [a[j], a[i]];
    setBlocks(a);
  };
  const remove = (i: number) => {
    const bid = blocks[i].id;
    setBlocks(bs => bs.filter((_, k) => k !== i));
    if (activeId === bid) setActiveId(null);
  };

  const handleSave = () => {
    onSave(title, blocks);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {mode === "edit" ? "Редагувати урок" : "Створити урок"}
      </h1>

      <input
        className="w-full border border-gray-300 rounded-lg p-3 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Назва уроку"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {["heading", "paragraph", "list", "quote", "code", "video", "image", "quiz"].map(t => (
          <button
            key={t}
            onClick={() => addBlock(t as ContentBlock["type"])}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm transition"
          >
            + {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {blocks.map((blk, idx) => (
          <div
            key={blk.id}
            className={`border p-4 rounded-lg shadow-sm transition hover:shadow-md cursor-pointer ${
              activeId === blk.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
            }`}
            onClick={() => setActiveId(blk.id)}
          >
            {blk.type === "heading" && (
              activeId === blk.id
                ? <input
                    type="text"
                    value={blk.text}
                    onChange={e => updateBlock(idx, b => ({ ...b, text: e.target.value }))}
                    className="w-full border-b text-xl font-semibold p-1 mb-2"
                  />
                : <h2 className="text-xl font-semibold">{blk.text}</h2>
            )}

            {blk.type === "paragraph" && (
              activeId === blk.id
                ? <Suspense fallback={<div>Завантаження редактора...</div>}>
                    <TextEditor
                      content={blk.text || ""}
                      onUpdate={(newContent: string) =>
                        updateBlock(idx, b => ({ ...b, text: newContent }))
                      }
                    />
                  </Suspense>
                : <p dangerouslySetInnerHTML={{ __html: blk.text || "" }} />
            )}

            {blk.type === "list" && (
              <div>
                {blk.items?.map((it, i) =>
                  <input
                    key={i}
                    className="w-full border rounded p-2 mb-1"
                    value={it}
                    onChange={e => {
                      const items = [...blk.items!];
                      items[i] = e.target.value;
                      updateBlock(idx, b => ({ ...b, items }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button
                    onClick={() => updateBlock(idx, b => ({
                      ...b, items: [...(b.items || []), ""]
                    }))}
                    className="text-sm text-blue-600 hover:underline"
                  >+ Пункт</button>
                )}
              </div>
            )}

            {blk.type === "quote" && (
              activeId === blk.id
                ? <textarea
                    value={blk.text}
                    onChange={e => updateBlock(idx, b => ({ ...b, text: e.target.value }))}
                    className="w-full border italic p-2 rounded"
                  />
                : <blockquote className="italic border-l-4 pl-4 text-gray-600">{blk.text}</blockquote>
            )}

            {blk.type === "code" && (
              activeId === blk.id
                ? <textarea
                    value={blk.code}
                    onChange={e => updateBlock(idx, b => ({ ...b, code: e.target.value }))}
                    className="w-full border font-mono p-2 rounded bg-gray-100"
                  />
                : <pre className="font-mono bg-gray-100 p-2 rounded">{blk.code}</pre>
            )}

            {blk.type === "video" && (
              <input
                className="w-full border rounded p-2 mb-2"
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
                    className="w-full border rounded p-2 mb-1"
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
                  <button
                    onClick={() => updateBlock(idx, b => ({
                      ...b, images: [...(b.images || []), ""]
                    }))}
                    className="text-sm text-blue-600 hover:underline"
                  >+ Зображення</button>
                )}
              </div>
            )}

            {blk.type === "quiz" && (
              <div>
                <input
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Питання"
                  value={blk.question}
                  onChange={e => updateBlock(idx, b => ({ ...b, question: e.target.value }))}
                />
                {blk.answers?.map((ans, i) =>
                  <input
                    key={i}
                    className="w-full border rounded p-2 mb-1"
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
                  <button
                    onClick={() => updateBlock(idx, b => ({
                      ...b, answers: [...(b.answers || []), ""]
                    }))}
                    className="text-sm text-blue-600 hover:underline"
                  >+ Варіант</button>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => move(idx, "up")} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">⬆️</button>
              <button onClick={() => move(idx, "down")} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">⬇️</button>
              <button onClick={() => remove(idx)} className="px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {message && <p className="text-green-600 mt-4">{message}</p>}

      <button
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
        onClick={handleSave}
      >
        {mode === "edit" ? "Зберегти зміни" : "Створити урок"}
      </button>
    </div>
  );
}
