"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface ArticleEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// 富文本编辑器（计划书 4.2：替代原生 textarea）
export default function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // 外部清空（如切换文章）时同步
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <div className="border rounded p-4 text-gray-400">Loading editor…</div>;

  const btn = (active: boolean) =>
    `px-2 py-1 text-sm border rounded ${active ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`;

  return (
    <div className="border rounded">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={btn(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
        <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" className="px-2 py-1 text-sm border rounded bg-white text-gray-700 hover:bg-gray-50" onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button type="button" className="px-2 py-1 text-sm border rounded bg-white text-gray-700 hover:bg-gray-50" onClick={() => editor.chain().focus().redo().run()}>Redo</button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[240px]" />
    </div>
  );
}
