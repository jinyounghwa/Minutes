'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Save, 
  MoreVertical, 
  Settings2,
  Trash2,
  Share2,
  Loader2,
  FileDown,
  ChevronDown
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

interface Project {
  id: string;
  name: string;
}

export default function NewMeetingPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<JSONContent | null>(null);
  const [contentText, setContentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    fetchProjects();
  }, []);

  const handleSave = async () => {
    if (!title) {
       alert('제목을 입력해 주세요');
       return;
    }
    setLoading(true);
    try {
      const res = await api.post('/meetings', {
        title,
        content,
        content_text: contentText,
        access_level: 'team', // default
        project_id: selectedProjectId,
      });
      router.push(`/dashboard/meetings/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('회의록 저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (templateContent: JSONContent) => {
    setContent(templateContent);
  };

  const selectedProjectName = projects.find(p => p.id === selectedProjectId)?.name || '미지정';

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
      {/* Editor Header */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-sm font-medium text-slate-500">
            새 회의록 작성
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4 text-xs text-slate-500">
             <span>자동 저장 활성화</span>
          </div>
          <Button size="sm" variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            공유
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            저장
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2" onClick={() => setShowTemplates(true)}>
                <FileDown className="w-4 h-4" /> 템플릿
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings2 className="w-4 h-4" /> 설정
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-red-500">
                <Trash2 className="w-4 h-4" /> 삭제
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

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto h-full space-y-4">
           
           {/* Title Input */}
           <input
             className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
             placeholder="회의록 제목"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             autoFocus
           />

           {/* Metadata Bar */}
           <div className="flex gap-4 mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     <span className="font-semibold text-slate-900 dark:text-white">프로젝트:</span>
                     {selectedProjectName}
                     <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => setSelectedProjectId(null)}>
                    미지정
                  </DropdownMenuItem>
                  {projects.map((project) => (
                    <DropdownMenuItem key={project.id} onClick={() => setSelectedProjectId(project.id)}>
                      {project.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                 <span className="font-semibold text-slate-900 dark:text-white">접근:</span>
                 팀
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