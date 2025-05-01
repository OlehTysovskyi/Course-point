import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
import { LessonContentBlock } from '../../../types/types';

export default function TextBlock({
  block,
  onChange,
}: {
  block: Extract<LessonContentBlock, { type: 'text' }>;
  onChange: (block: LessonContentBlock) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Underline],
    content: block.content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== block.content) {
        onChange({ ...block, content: html });
      }
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="border rounded-xl p-3 shadow-sm bg-white">
      <div className="mb-3 flex gap-2 flex-wrap items-center">
        <button
          type="button"
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>Жирний</strong>
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>Курсив</em>
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded hover:bg-gray-100"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>Підкреслення</u>
        </button>
        <label className="flex items-center gap-1 text-sm">
          <span>Колір</span>
          <input
            type="color"
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 border rounded p-0 cursor-pointer"
          />
        </label>
      </div>
      <EditorContent
        editor={editor}
        className="prose min-h-[150px] border p-3 rounded bg-white focus:outline-none"
      />
    </div>
  );
}
