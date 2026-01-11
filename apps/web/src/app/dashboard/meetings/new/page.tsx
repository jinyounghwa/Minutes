'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  Save, 
  MoreVertical, 
  Settings2,
  Trash2,
  Share2,
  Loader2,
  FileDown
} from 'lucide-react';
import Editor from '@/components/editor/Editor';
import TemplateManager from '@/components/dashboard/TemplateManager';
import api from '@/lib/api';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { JSONContent } from '@tiptap/react';

export default function NewMeetingPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<JSONContent | null>(null);
  const [contentText, setContentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!title) {
       alert('Please enter a title');
       return;
    }
    setLoading(true);
    try {
      const res = await api.post('/meetings', {
        title,
        content,
        content_text: contentText,
        access_level: 'team', // default
      });
      router.push(`/dashboard/meetings/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (templateContent: JSONContent) => {
    setContent(templateContent);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
      {/* Editor Header */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <input
            className="text-lg font-bold bg-transparent border-none focus:outline-none placeholder:text-slate-400 w-full max-w-lg"
            placeholder="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4 text-xs text-slate-500">
             <span>Auto-saving enabled</span>
          </div>
          <Button size="sm" variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2" onClick={() => setShowTemplates(true)}>
                <FileDown className="w-4 h-4" /> Templates
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings2 className="w-4 h-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-red-500">
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Template Manager */}
      <TemplateManager
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto h-full space-y-4">
           {/* Metadata Bar */}
           <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                 <span className="font-semibold text-slate-900 dark:text-white">Project:</span>
                 Unassigned
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                 <span className="font-semibold text-slate-900 dark:text-white">Access:</span>
                 Team
              </div>
           </div>
           
           <Editor 
             onChange={(json, text) => {
               setContent(json);
               setContentText(text);
             }} 
           />
        </div>
      </div>
    </div>
  );
}
