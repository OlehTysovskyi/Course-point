import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "../../../components/layout/TextEditor";

type TextBlock = { id: string; type: "text"; content: string };
type VideoBlock = { id: string; type: "video"; url: string };
type QuizBlock = {
  id: string;
  type: "quiz";
  question: string;
  answers: string[];
  correctIndex: number;
};

type Block = TextBlock | VideoBlock | QuizBlock;

export default function EditLessonPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const createBlock = (type: Block["type"]): Block => {
    switch (type) {
      case "text":
        return { id: uuidv4(), type: "text", content: "<p>Новий текст</p>" };
      case "video":
        return { id: uuidv4(), type: "video", url: "" };
      case "quiz":
        return {
          id: uuidv4(),
          type: "quiz",
          question: "Нове питання",
          answers: ["Варіант 1", "Варіант 2"],
          correctIndex: 0,
        };
      default:
        throw new Error("Невідомий тип блоку");
    }
  };

  const addBlock = (type: Block["type"]) => {
    const newBlock = createBlock(type);
    setBlocks((prev) => [...prev, newBlock]);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    const removedId = blocks[index].id;
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    if (activeBlockId === removedId) {
      setActiveBlockId(null);
    }
  };

  const handleBlockClick = (block: Block) => {
    setActiveBlockId(block.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Редагування уроку</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => addBlock("text")} className="bg-green-500 text-white px-4 py-2 rounded">
          ➕ Додати текст
        </button>
        <button onClick={() => addBlock("video")} className="bg-blue-500 text-white px-4 py-2 rounded">
          ➕ Додати відео
        </button>
        <button onClick={() => addBlock("quiz")} className="bg-yellow-500 text-white px-4 py-2 rounded">
          ➕ Додати тест
        </button>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className={`border p-4 rounded ${activeBlockId === block.id ? "border-blue-500" : ""}`}
            onClick={() => handleBlockClick(block)}
          >
            <div className="mb-2">
              {block.type === "text" ? (
                activeBlockId === block.id ? (
                  <TextEditor
                    content={block.content}
                    onUpdate={(newContent) => {
                      const newBlocks = [...blocks];
                      (newBlocks[index] as TextBlock).content = newContent;
                      setBlocks(newBlocks);
                    }}
                  />
                ) : (
                  <div
                    className="w-full border rounded p-2 min-h-[100px]"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )
              ) : null}

              {block.type === "video" && (
                <input
                  className="w-full border rounded p-2"
                  placeholder="URL відео"
                  value={block.url}
                  onChange={(e) => {
                    const newBlocks = [...blocks];
                    (newBlocks[index] as VideoBlock).url = e.target.value;
                    setBlocks(newBlocks);
                  }}
                />
              )}

              {block.type === "quiz" && (
                <div>
                  <input
                    className="w-full border rounded p-2 mb-2"
                    placeholder="Питання"
                    value={block.question}
                    onChange={(e) => {
                      const newBlocks = [...blocks];
                      (newBlocks[index] as QuizBlock).question = e.target.value;
                      setBlocks(newBlocks);
                    }}
                  />
                  {block.answers.map((answer, aIdx) => (
                    <input
                      key={aIdx}
                      className="w-full border rounded p-2 mb-1"
                      placeholder={`Варіант ${aIdx + 1}`}
                      value={answer}
                      onChange={(e) => {
                        const newBlocks = [...blocks];
                        (newBlocks[index] as QuizBlock).answers[aIdx] = e.target.value;
                        setBlocks(newBlocks);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => moveBlock(index, "up")} className="px-2 py-1 border rounded">
                ⬆️
              </button>
              <button onClick={() => moveBlock(index, "down")} className="px-2 py-1 border rounded">
                ⬇️
              </button>
              <button onClick={() => removeBlock(index)} className="px-2 py-1 border rounded text-red-500">
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
