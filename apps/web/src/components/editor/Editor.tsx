'use client';

import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code,
  Table as TableIcon,
  CheckSquare,
  Heading1,
  Heading2
} from 'lucide-react';

interface EditorProps {
  content?: JSONContent;
  onChange?: (json: JSONContent, text: string) => void;
  editable?: boolean;
}

export default function Editor({ content, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your meeting notes...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CharacterCount,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON(), editor.getText());
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <CheckSquare className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            <Quote className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <TableIcon className="w-4 h-4" />
          </Button>
          <div className="flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 prose prose-slate dark:prose-invert max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] text-slate-500 flex justify-between">
        <div>{editor.storage.characterCount.characters()} characters</div>
        <div>Tiptap V2 Editor</div>
      </div>
    </div>
  );
}
