import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

type TextEditorProps = {
  content: string;
  onUpdate: (content: string) => void;
};

const COLORS = [
  { name: 'default', hex: 'black' },
  { name: 'gray', hex: '#9B9B9B' },
  { name: 'brown', hex: '#A0522D' },
  { name: 'orange', hex: '#FF8C00' },
  { name: 'yellow', hex: '#FFD700' },
  { name: 'green', hex: '#2E8B57' },
  { name: 'blue', hex: '#1E90FF' },
  { name: 'purple', hex: '#8A2BE2' },
  { name: 'pink', hex: '#FF69B4' },
  { name: 'red', hex: '#FF4500' },
];

export default function TextEditor({ content, onUpdate }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Underline, Color, TextStyle],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      <div className="mb-2 space-x-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded font-bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded italic"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-2 py-1 border rounded underline"
        >
          U
        </button>

        {COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => editor.chain().focus().setColor(color.hex).run()}
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>

      <EditorContent editor={editor} className="border p-4 rounded bg-white min-h-[200px]" />
    </div>
  );
}
