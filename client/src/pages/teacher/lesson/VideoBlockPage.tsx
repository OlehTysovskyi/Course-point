import { LessonContentBlock } from "../../../types/types";

export default function VideoBlock({
  block,
  onChange,
}: {
  block: Extract<LessonContentBlock, { type: "video" }>;
  onChange: (block: LessonContentBlock) => void;
}) {
  return (
    <input
      className="w-full border p-2 rounded"
      placeholder="Вставте URL відео"
      value={block.url}
      onChange={e => onChange({ ...block, url: e.target.value })}
    />
  );
}
