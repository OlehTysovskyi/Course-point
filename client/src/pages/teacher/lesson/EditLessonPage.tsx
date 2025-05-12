import { lazy, Suspense, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type HeadingBlock = { id: string; type: "heading"; level: number; text: string };
type ParagraphBlock = { id: string; type: "paragraph"; text: string };
type ListBlock = { id: string; type: "list"; items: string[] };
type QuoteBlock = { id: string; type: "quote"; text: string };
type CodeBlock = { id: string; type: "code"; code: string };
type VideoBlock = { id: string; type: "video"; url: string };
type ImageBlock = { id: string; type: "image"; images: string[] };
type QuizBlock = { id: string; type: "quiz"; question: string; answers: string[]; correctIndex: number };
type Block = HeadingBlock | ParagraphBlock | ListBlock | QuoteBlock | CodeBlock | VideoBlock | ImageBlock | QuizBlock;


const TextEditor = lazy(() => import("../../../components/layout/TextEditor"));

export default function EditLessonPage() {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const createBlock = (type: Block["type"]): Block => {
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

  const addBlock = (t: Block["type"]) => setBlocks(bs => [...bs, createBlock(t)]);
  const updateBlock = (idx: number, fn: (b: Block) => Block) => {
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Редагувати урок</h1>
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
            onClick={() => addBlock(t as Block["type"])}
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
            className={`border p - 4 rounded ${activeId === blk.id ? "border-blue-500" : ""} `}
            onClick={() => setActiveId(blk.id)}
          >
            {/* Рендер редактора або перегляду для кожного type */}
            {blk.type === "heading" && (
              activeId === blk.id
                ? <input
                  type="text"
                  value={blk.text}
                  onChange={e => updateBlock(idx, b => ({ ...(b as HeadingBlock), text: e.target.value }))}
                  placeholder="Заголовок"
                  className="w-full border mb-2 p-1 text-xl font-semibold"
                />
                : <h2 className="text-xl font-semibold">{blk.text}</h2>
            )}

            {blk.type === "paragraph" && (
              activeId === blk.id
                ? <Suspense fallback={<div>Завантаження редактора...</div>}>
                  <TextEditor
                    content={blk.text}
                    onUpdate={(newContent: any) => updateBlock(idx, b => ({ ...(b as ParagraphBlock), text: newContent }))}
                  />
                </Suspense>
                : <p dangerouslySetInnerHTML={{ __html: blk.text }} />
            )}

            {blk.type === "list" && (
              <div>
                {(blk as ListBlock).items.map((it, i) =>
                  <input
                    key={i}
                    className="w-full border mb-1 p-1"
                    value={it}
                    onChange={e => {
                      const items = [...(blk as ListBlock).items];
                      items[i] = e.target.value;
                      updateBlock(idx, b => ({ ...(b as ListBlock), items }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button onClick={() => updateBlock(idx, b => {
                    const items = [...(b as ListBlock).items, ""];
                    return { ...b, items };
                  })} className="text-sm text-blue-600">+Пункт</button>
                )}
              </div>
            )}

            {blk.type === "quote" && (
              activeId === blk.id
                ? <textarea
                  value={blk.text}
                  onChange={e => updateBlock(idx, b => ({ ...(b as QuoteBlock), text: e.target.value }))}
                  className="w-full border italic p-2"
                />
                : <blockquote className="italic border-l-4 pl-4">{blk.text}</blockquote>
            )}

            {blk.type === "code" && (
              activeId === blk.id
                ? <textarea
                  value={(blk as CodeBlock).code}
                  onChange={e => updateBlock(idx, b => ({ ...(b as CodeBlock), code: e.target.value }))}
                  className="w-full border font-mono p-2 bg-gray-100"
                />
                : <pre className="font-mono bg-gray-100 p-2">{(blk as CodeBlock).code}</pre>
            )}

            {blk.type === "video" && (
              <input
                className="w-full border mb-2 p-1"
                placeholder="URL відео"
                value={(blk as VideoBlock).url}
                onChange={e => updateBlock(idx, b => ({ ...(b as VideoBlock), url: e.target.value }))}
              />
            )}

            {blk.type === "image" && (
              <div>
                {(blk as ImageBlock).images.map((src, i) =>
                  <input
                    key={i}
                    className="w-full border mb-1 p-1"
                    placeholder="URL картинки"
                    value={src}
                    onChange={e => {
                      const imgs = [...(blk as ImageBlock).images];
                      imgs[i] = e.target.value;
                      updateBlock(idx, b => ({ ...(b as ImageBlock), images: imgs }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button onClick={() => updateBlock(idx, b => {
                    const imgs = [...(b as ImageBlock).images, ""];
                    return { ...b, images: imgs };
                  })} className="text-sm text-blue-600">+Зображення</button>
                )}
              </div>
            )}

            {blk.type === "quiz" && (
              <div>
                <input
                  className="w-full border mb-1 p-1"
                  placeholder="Питання"
                  value={(blk as QuizBlock).question}
                  onChange={e => updateBlock(idx, b => ({ ...(b as QuizBlock), question: e.target.value }))}
                />
                {(blk as QuizBlock).answers.map((ans, i) =>
                  <input
                    key={i}
                    className="w-full border mb-1 p-1"
                    placeholder={`Відповідь ${i + 1} `}
                    value={ans}
                    onChange={e => {
                      const answ = [...(blk as QuizBlock).answers];
                      answ[i] = e.target.value;
                      updateBlock(idx, b => ({ ...(b as QuizBlock), answers: answ }));
                    }}
                  />
                )}
                {activeId === blk.id && (
                  <button onClick={() => updateBlock(idx, b => {
                    const answ = [...(b as QuizBlock).answers, ""];
                    return { ...b, answers: answ };
                  })} className="text-sm text-blue-600">+Варіант</button>
                )}
              </div>
            )}

            {/* Кнопки керування */}
            <div className="flex gap-2 mt-2">
              <button onClick={() => move(idx, "up")} className="px-2 border">⬆️</button>
              <button onClick={() => move(idx, "down")} className="px-2 border">⬇️</button>
              <button onClick={() => remove(idx)} className="px-2 border text-red-500">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
        onClick={async () => {
          const lesson = { title, blocks };
          await fetch('/api/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lesson)
          });
          // редірект або повідомлення…
        }}
      >
        Зберегти урок
      </button>
    </div>
  );
}
