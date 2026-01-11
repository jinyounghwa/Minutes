'use client';

import { useState, useEffect, use } from 'react';
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
  History,
  FileDown,
  ExternalLink,
  Info
} from 'lucide-react';
import Editor from '@/components/editor/Editor';
import VersionHistoryPanel from '@/components/dashboard/VersionHistoryPanel';
import ActionItems from '@/components/dashboard/ActionItems';
import TemplateManager from '@/components/dashboard/TemplateManager';
import InlinePreview from '@/components/dashboard/InlinePreview';
import api from '@/lib/api';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Meeting {
  id: string;
  title: string;
  content: JSONContent;
  access_level: string;
  created_at: string;
  creator?: { name: string };
}

interface ImpactAnalysis {
  impactedCount: number;
  impactedMeetings: Array<{ id: string; title: string }>;
}

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [contentText, setContentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [linkedMeetings, setLinkedMeetings] = useState<string[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    fetchMeeting();
    fetchLinks();
  }, [id]);

  const fetchLinks = async () => {
    try {
      const res = await api.get(`/meetings/${id}/links`);
      setLinkedMeetings(res.data.outbound.map((link: any) => link.meetingId));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeeting = async () => {
    try {
      const res = await api.get(`/meetings/${id}`);
      setMeeting(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/meetings/${id}`, {
        title,
        content,
        content_text: contentText,
      });
    } catch (err) {
      console.error(err);
      alert('회의록 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await api.get(`/meetings/${id}/impact`);
      setImpactAnalysis(res.data);
      setShowDeleteDialog(true);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/meetings/${id}`);
      router.push('/dashboard/meetings');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await api.post(`/meetings/${id}/versions/${versionId}/restore`);
      fetchMeeting();
    } catch (err) {
      console.error(err);
      alert('버전 복구에 실패했습니다');
    }
  };

  const handleSelectTemplate = (templateContent: JSONContent) => {
    setContent(templateContent);
  };

  const getAccessLevelName = (level: string) => {
    switch (level) {
      case 'public': return '공개';
      case 'team': return '팀';
      case 'private': return '비공개';
      default: return level;
    }
  };

  if (loading || !meeting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <div className={`flex flex-col flex-1 transition-all duration-300 ${showSidePanel ? 'mr-96' : ''}`}>
        {/* Editor Header */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/meetings')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <input
              className="text-lg font-bold bg-transparent border-none focus:outline-none placeholder:text-slate-400 w-full max-w-lg"
              placeholder="회의록 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="gap-2 hidden md:flex" onClick={() => setShowSidePanel(!showSidePanel)}>
              <ExternalLink className="w-4 h-4" />
              사이드 패널
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              공유
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleUpdate} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              저장
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2" onClick={() => setShowVersionHistory(true)}>
                  <History className="w-4 h-4" /> 버전 히스토리
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => setShowTemplates(true)}>
                  <FileDown className="w-4 h-4" /> 템플릿
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <FileDown className="w-4 h-4" /> 마크다운으로 내보내기
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <Settings2 className="w-4 h-4" /> 설정
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-red-500" onClick={handleDeleteClick}>
                  <Trash2 className="w-4 h-4" /> 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Editor Body */}
        <div className="flex-1 overflow-hidden p-4 md:p-8 bg-slate-50 dark:bg-slate-950/50">
          <div className="max-w-4xl mx-auto h-full space-y-4">
            <div className="flex gap-4 mb-4 items-center">
              <Badge variant="outline" className="gap-1.5 font-normal capitalize py-1 px-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                 {getAccessLevelName(meeting.access_level)}
              </Badge>
              <span className="text-xs text-slate-500">
                 {meeting.creator?.name}님이 {format(new Date(meeting.created_at), 'yyyy년 M월 d일', { locale: ko })}에 생성
              </span>
            </div>
            
            <Editor 
              content={content}
              onChange={(json, text) => {
                setContent(json);
                setContentText(text);
              }} 
            />
            
            <ActionItems meetingId={id} />
          </div>
        </div>
      </div>

      {/* Version History Panel */}
      <VersionHistoryPanel
        meetingId={id}
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        onRestore={handleRestoreVersion}
      />

      {/* Template Manager */}
      <TemplateManager
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Side Panel */}
      {showSidePanel && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-20 shadow-xl flex flex-col">
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
             <h3 className="font-semibold text-sm">참조 문서</h3>
             <Button variant="ghost" size="icon" onClick={() => setShowSidePanel(false)}>
               <ChevronLeft className="w-4 h-4 rotate-180" />
             </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
             <div className="space-y-4">
                {linkedMeetings.length === 0 ? (
                  <div className="text-center py-8">
                    <ExternalLink className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">연결된 회의록이 없습니다</p>
                    <p className="text-xs text-slate-400">다른 회의록을 연결하면 여기에 프리뷰가 표시됩니다</p>
                  </div>
                ) : (
                  linkedMeetings.map((meetingId) => (
                    <InlinePreview
                      key={meetingId}
                      meetingId={meetingId}
                      onClose={() => {
                        setLinkedMeetings(linkedMeetings.filter(id => id !== meetingId));
                      }}
                    />
                  ))
                )}
             </div>
          </ScrollArea>
        </div>
      )}

      {/* Delete Impact Analysis Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
               <Info className="w-5 h-5" /> 삭제 영향도 분석
            </DialogTitle>
            <DialogDescription>
              경고: 이 문서를 삭제하면 다른 회의록의 링크가 깨질 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {impactAnalysis && (
            <div className="py-4">
               <p className="text-sm font-medium mb-3">이 회의록을 참조하는 문서 ({impactAnalysis.impactedCount}):</p>
               <ScrollArea className="h-40 border rounded-md p-2">
                  <ul className="space-y-2">
                    {impactAnalysis.impactedMeetings.length > 0 ? (
                      impactAnalysis.impactedMeetings.map((m) => (
                        <li key={m.id} className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-400">
                           <div className="w-1 h-1 rounded-full bg-slate-400" />
                           {m.title}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-slate-500 italic">들어오는 링크가 없습니다. 안전하게 삭제할 수 있습니다.</li>
                    )}
                  </ul>
               </ScrollArea>
               <p className="mt-4 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-3 rounded">
                  이 문서는 영구 삭제 전 30일 동안 휴지통에 보관됩니다.
               </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>취소</Button>
            <Button variant="destructive" onClick={confirmDelete}>휴지통으로 이동</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
