import { LessonContentBlock } from "../../../types/types";

export default function QuizBlock({
  block,
  onChange,
}: {
  block: Extract<LessonContentBlock, { type: "quiz" }>;
  onChange: (block: LessonContentBlock) => void;
}) {
  const updateOption = (index: number, value: string) => {
    const newOptions = [...block.options];
    newOptions[index] = value;
    onChange({ ...block, options: newOptions });
  };

  const addOption = () => {
    onChange({ ...block, options: [...block.options, ""] });
  };

  const removeOption = (index: number) => {
    const newOptions = block.options.filter((_, i) => i !== index);
    const newCorrectIndex = block.correctIndex >= newOptions.length ? 0 : block.correctIndex;
    onChange({ ...block, options: newOptions, correctIndex: newCorrectIndex });
  };

  return (
    <div className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="Запитання"
        value={block.question}
        onChange={e => onChange({ ...block, question: e.target.value })}
      />

      <div className="space-y-2">
        {block.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct"
              checked={block.correctIndex === i}
              onChange={() => onChange({ ...block, correctIndex: i })}
            />
            <input
              className="flex-1 border p-2 rounded"
              placeholder={`Варіант ${i + 1}`}
              value={opt}
              onChange={e => updateOption(i, e.target.value)}
            />
            {block.options.length > 2 && (
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeOption(i)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addOption}
          className="text-blue-600 hover:underline text-sm"
        >
          + Додати варіант
        </button>
      </div>
    </div>
  );
}
